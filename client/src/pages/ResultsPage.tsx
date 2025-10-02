import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeToggle } from '../components/ThemeToggle';
import '../styles/ResultsPage.css';

interface AIResponse {
  provider: string;
  model: string;
  response: string | null;
  status: 'success' | 'error' | 'loading';
  error?: string;
  executionTime: number;
}

interface ConversationMessage {
  query: string;
  results: AIResponse[];
}

interface ConversationSession {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'tipai_conversations';
const ACTIVE_SESSION_KEY = 'tipai_active_session';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state as { query: string; results: AIResponse[] };

  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  // Инициализация сессий при монтировании компонента
  useEffect(() => {
    if (initialized) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    let loadedSessions: ConversationSession[] = [];

    if (saved) {
      try {
        loadedSessions = JSON.parse(saved);
      } catch {
        loadedSessions = [];
      }
    }

    // Проверяем, есть ли активная сессия
    const savedActive = localStorage.getItem(ACTIVE_SESSION_KEY);

    // Проверяем тип навигации - это новый запрос или обновление страницы
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isPageReload = !initialState || !initialState.results || navigationEntry?.type === 'reload';

    // Если это обновление страницы, загружаем существующие сессии
    if (isPageReload) {
      if (savedActive && loadedSessions.find(s => s.id === savedActive)) {
        // Загружаем существующую активную сессию
        setSessions(loadedSessions);
        setActiveSessionId(savedActive);
      } else if (loadedSessions.length > 0) {
        // Выбираем первую сессию
        setSessions(loadedSessions);
        setActiveSessionId(loadedSessions[0].id);
      } else {
        // Нет сессий - переходим на главную
        navigate('/');
        return;
      }
    } else if (initialState && initialState.query && initialState.results) {
      // Это новый запрос с главной страницы - создаем новую сессию
      const newId = `session_${Date.now()}`;
      const newSession: ConversationSession = {
        id: newId,
        title: initialState.query.slice(0, 50) + (initialState.query.length > 50 ? '...' : ''),
        messages: [{ query: initialState.query, results: initialState.results }],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      setSessions([newSession, ...loadedSessions]);
      setActiveSessionId(newId);
    } else {
      // Неизвестное состояние - загружаем существующие сессии или переходим на главную
      if (loadedSessions.length > 0) {
        setSessions(loadedSessions);
        setActiveSessionId(savedActive || loadedSessions[0].id);
      } else {
        navigate('/');
        return;
      }
    }

    setInitialized(true);

    // На мобильных устройствах закрываем сайдбар после загрузки
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [initialized, initialState, navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // На мобильных устройствах сайдбар по умолчанию закрыт
    return window.innerWidth > 768;
  });
  const [newQuery, setNewQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const conversation = activeSession?.messages || [];

  // Сохраняем сессии в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
  }, [sessions, activeSessionId]);

  useEffect(() => {
    // Прокрутка вниз при добавлении нового сообщения
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }, [conversation]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.trim() || loading) return;

    setLoading(true);

    // На мобильных закрываем сайдбар при отправке запроса
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }

    // Получаем провайдеров из первого запроса
    const providers = initialState.results.map(r => r.provider.toLowerCase().replace(/\s+/g, ''));

    // Создаем заглушки с анимацией загрузки (используем имена из первого запроса)
    const loadingResults: AIResponse[] = providers.map(provider => {
      const originalResult = initialState.results.find(
        r => r.provider.toLowerCase().replace(/\s+/g, '') === provider
      );
      return {
        provider: originalResult?.provider || provider.charAt(0).toUpperCase() + provider.slice(1),
        model: '',
        response: null,
        status: 'loading',
        executionTime: 0
      };
    });

    // Добавляем сообщение с загрузкой в активную сессию
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, { query: newQuery, results: loadingResults }],
          updatedAt: Date.now()
        };
      }
      return session;
    }));

    const queryToSend = newQuery;
    setNewQuery('');

    // Формируем историю разговора для отправки на сервер
    const conversationHistory = conversation.flatMap(msg => {
      // Берем первый успешный ответ для каждого сообщения
      const successfulResponse = msg.results.find(r => r.status === 'success' && r.response);
      return [
        { role: 'user' as const, content: msg.query },
        ...(successfulResponse ? [{ role: 'assistant' as const, content: successfulResponse.response || '' }] : [])
      ];
    });

    try {
      const response = await axios.post('/api/query', {
        query: queryToSend,
        providers,
        conversationHistory
      });

      // Заменяем загрузочные карточки на реальные результаты
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          const newMessages = [...session.messages];
          newMessages[newMessages.length - 1] = { query: queryToSend, results: response.data.results };
          return {
            ...session,
            messages: newMessages,
            updatedAt: Date.now()
          };
        }
        return session;
      }));
    } catch (error) {
      console.error('Ошибка запроса:', error);
      // Удаляем загрузочное сообщение при ошибке
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: session.messages.slice(0, -1)
          };
        }
        return session;
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    navigate('/');
  };

  const handleNewConversation = () => {
    navigate('/');
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Удалить этот диалог?')) {
      const newSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(newSessions);

      if (sessionId === activeSessionId) {
        if (newSessions.length > 0) {
          setActiveSessionId(newSessions[0].id);
        } else {
          navigate('/');
        }
      }
    }
  };

  const handleClearAllSessions = () => {
    if (confirm('Очистить всю историю диалогов?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      navigate('/');
    }
  };

  return (
    <div className="results-page">
      {/* Sidebar toggle button (always visible) */}
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="open-sidebar-btn" title="Показать историю">
          ▶
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button onClick={handleNewConversation} className="new-chat-btn">
            ➕ Новый диалог
          </button>
          <button onClick={() => setSidebarOpen(false)} className="toggle-sidebar-btn">
            ◀
          </button>
        </div>

        <div className="sessions-list">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <div className="session-title">{session.title}</div>
              <div className="session-meta">
                <span className="session-count">{session.messages.length} сообщ.</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                  className="delete-session-btn"
                  title="Удалить"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button onClick={handleClearAllSessions} className="clear-all-btn">
            🗑️ Очистить всё
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
        <header className="search-header">
          <div className="header-left">
            <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn" title="Меню">
              ☰
            </button>
            <h1 onClick={handleNewSearch} className="logo">TipAI.ru</h1>
            <ThemeToggle />
          </div>

          <form onSubmit={handleContinue} className="continue-search-form">
            <input
              type="text"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              placeholder="Продолжить диалог..."
              className="continue-search-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="continue-search-btn"
              disabled={loading || !newQuery.trim()}
            >
              {loading ? '⏳' : '→'}
            </button>
          </form>
        </header>

        <div className="conversation-container" ref={containerRef}>
          {conversation.map((message, msgIndex) => (
            <div key={msgIndex} className="conversation-block">
              <div className="query-display">
                <strong>Вы:</strong> {message.query}
              </div>

              <div className="responses-grid-compact">
                {message.results.map((result, index) => (
                  <div key={index} className={`response-card-compact ${result.status}`}>
                    <div className="card-header-compact">
                      <h3>{result.provider}</h3>
                      {result.status === 'loading' ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <span className="time-badge">{result.executionTime}ms</span>
                      )}
                    </div>

                    <div className="card-body-compact">
                      {result.status === 'loading' ? (
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : result.status === 'success' ? (
                        <p className="response-text">{result.response}</p>
                      ) : (
                        <p className="error-text">❌ {result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;