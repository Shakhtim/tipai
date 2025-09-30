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

interface AIResponse {
  provider: string;
  model: string;
  response: string | null;
  status: 'success' | 'error';
  error?: string;
  executionTime: number;
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
      const response = await axios.get('http://localhost:5000/api/providers');
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
      const response = await axios.post('http://localhost:5000/api/query', {
        query,
        providers: Array.from(selectedProviders)
      });

      navigate('/results', {
        state: {
          query,
          results: response.data.results
        }
      });
    } catch (error) {
      console.error('Ошибка запроса:', error);
      setLoading(false);
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
            placeholder="Введите ваш запрос..."
            className="query-input"
            rows={6}
          />

          <div className="providers-section">
            <h3>Выберите AI модели:</h3>
            <div className="providers-grid">
              {providers.map((provider) => (
                <label
                  key={provider.id}
                  className={`provider-card ${
                    !provider.available ? 'disabled' : ''
                  } ${selectedProviders.has(provider.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProviders.has(provider.id)}
                    onChange={() => toggleProvider(provider.id)}
                    disabled={!provider.available}
                  />
                  <div className="provider-info">
                    <span className="provider-name">{provider.name}</span>
                    {!provider.available && (
                      <span className="provider-status">{provider.reason}</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || !query.trim() || selectedProviders.size === 0}
          >
            {loading ? 'Обработка...' : 'Сравнить ответы'}
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