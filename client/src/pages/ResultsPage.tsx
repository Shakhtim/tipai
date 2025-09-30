import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeToggle } from '../components/ThemeToggle';
import '../styles/ResultsPage.css';

interface AIResponse {
  provider: string;
  model: string;
  response: string | null;
  status: 'success' | 'error';
  error?: string;
  executionTime: number;
}

interface ConversationMessage {
  query: string;
  results: AIResponse[];
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state as { query: string; results: AIResponse[] };

  const [conversation, setConversation] = useState<ConversationMessage[]>([
    { query: initialState.query, results: initialState.results }
  ]);
  const [newQuery, setNewQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.trim() || loading) return;

    setLoading(true);

    try {
      // Получаем провайдеров из первого запроса
      const providers = initialState.results.map(r => r.provider.toLowerCase().replace(/\s+/g, ''));

      const response = await axios.post('http://localhost:5000/api/query', {
        query: newQuery,
        providers
      });

      setConversation([...conversation, { query: newQuery, results: response.data.results }]);
      setNewQuery('');
    } catch (error) {
      console.error('Ошибка запроса:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    navigate('/');
  };

  return (
    <div className="results-page">
      <ThemeToggle />

      <header className="search-header">
        <h1 onClick={handleNewSearch} className="logo">TipAI.ru</h1>

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

      <div className="conversation-container">
        {conversation.map((message, msgIndex) => (
          <div key={msgIndex} className="conversation-block">
            <div className="query-display">
              <strong>Запрос:</strong> {message.query}
            </div>

            <div className="responses-grid-compact">
              {message.results.map((result, index) => (
                <div key={index} className={`response-card-compact ${result.status}`}>
                  <div className="card-header-compact">
                    <h3>{result.provider}</h3>
                    <span className="time-badge">{result.executionTime}ms</span>
                  </div>

                  <div className="card-body-compact">
                    {result.status === 'success' ? (
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