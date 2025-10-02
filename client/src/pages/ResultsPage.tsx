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

const STORAGE_KEY = 'tipai_chat_history';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state as { query: string; results: AIResponse[] };

  const [conversation, setConversation] = useState<ConversationMessage[]>(() => {
    // Загружаем историю из localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [{ query: initialState.query, results: initialState.results }];
      }
    }
    return [{ query: initialState.query, results: initialState.results }];
  });
  const [newQuery, setNewQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Сохраняем историю в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  }, [conversation]);

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

    // Добавляем сообщение с загрузкой
    setConversation([...conversation, { query: newQuery, results: loadingResults }]);
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
      setConversation(prev => {
        const newConv = [...prev];
        newConv[newConv.length - 1] = { query: queryToSend, results: response.data.results };
        return newConv;
      });
    } catch (error) {
      console.error('Ошибка запроса:', error);
      // Удаляем загрузочное сообщение при ошибке
      setConversation(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    navigate('/');
  };

  const handleClearHistory = () => {
    if (confirm('Очистить всю историю чата?')) {
      localStorage.removeItem(STORAGE_KEY);
      navigate('/');
    }
  };

  return (
    <div className="results-page">
      <ThemeToggle />

      <header className="search-header">
        <div className="header-left">
          <h1 onClick={handleNewSearch} className="logo">TipAI.ru</h1>
          <button onClick={handleClearHistory} className="clear-history-btn" title="Очистить историю">
            🗑️
          </button>
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
  );
};

export default ResultsPage;