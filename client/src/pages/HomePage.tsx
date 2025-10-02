import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeToggle } from '../components/ThemeToggle';
import '../App.css';

interface AIProvider {
  id: string;
  name: string;
  models: string[];
  available: boolean;
  reason?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get('/api/providers');
      setProviders(response.data.providers);

      const availableProviders = response.data.providers
        .filter((p: AIProvider) => p.available)
        .map((p: AIProvider) => p.id);
      setSelectedProviders(new Set(availableProviders));
    } catch (error) {
      console.error('Ошибка загрузки провайдеров:', error);
    }
  };

  const toggleProvider = (providerId: string) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(providerId)) {
      newSelected.delete(providerId);
    } else {
      newSelected.add(providerId);
    }
    setSelectedProviders(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || selectedProviders.size === 0) return;

    setLoading(true);

    try {
      const response = await axios.post('/api/query', {
        query,
        providers: Array.from(selectedProviders)
      });

      navigate('/results', {
        state: {
          query,
          results: response.data.results,
          isNewQuery: true,
          timestamp: Date.now()
        }
      });
    } catch (error) {
      console.error('Ошибка запроса:', error);
      setLoading(false);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter для отправки
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="app">
      <ThemeToggle />

      <header className="app-header">
        <h1>TipAI.ru</h1>
        <p>Топовые AI в одном месте - сравнивайте ответы лучших моделей</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="query-form">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Введите ваш запрос..."
            className="query-input"
            rows={6}
            autoFocus
          />

          <div className="providers-section">
            <h3>Выберите AI модели:</h3>
            <div className="providers-grid">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`provider-card ${
                    !provider.available ? 'disabled' : ''
                  } ${selectedProviders.has(provider.id) ? 'selected' : ''}`}
                  onClick={() => provider.available && toggleProvider(provider.id)}
                  onKeyDown={(e) => {
                    if ((e.key === ' ' || e.key === 'Enter') && provider.available) {
                      e.preventDefault();
                      toggleProvider(provider.id);
                    }
                  }}
                  tabIndex={provider.available ? 0 : -1}
                  role="checkbox"
                  aria-checked={selectedProviders.has(provider.id)}
                  aria-disabled={!provider.available}
                >
                  <input
                    type="checkbox"
                    checked={selectedProviders.has(provider.id)}
                    onChange={() => {}}
                    disabled={!provider.available}
                    tabIndex={-1}
                  />
                  <div className="provider-info">
                    <span className="provider-name">{provider.name}</span>
                    {!provider.available && (
                      <span className="provider-status">{provider.reason}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || !query.trim() || selectedProviders.size === 0}
          >
            {loading ? 'Обработка...' : 'Спросить'}
          </button>
        </form>
      </main>

      <footer className="app-footer">
        <p>TipAI.ru © 2025 | Лучшие AI модели для ваших задач</p>
      </footer>
    </div>
  );
};

export default HomePage;