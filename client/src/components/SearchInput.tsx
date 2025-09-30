import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setCurrentQuery, fetchAIResponses } from '../store/slices/aiSlice';

export const SearchInput = () => {
  const dispatch = useAppDispatch();
  const { currentQuery, selectedProviders, loading } = useAppSelector(state => state.ai);
  const [localQuery, setLocalQuery] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim() && selectedProviders.length > 0 && !loading) {
      dispatch(setCurrentQuery(localQuery));
      dispatch(fetchAIResponses({
        query: localQuery,
        providers: selectedProviders
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-container">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Задайте вопрос всем AI сразу..."
          className="search-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="search-button"
          disabled={loading || !localQuery.trim() || selectedProviders.length === 0}
        >
          {loading ? 'Загрузка...' : 'Поиск'}
        </button>
      </div>
      {selectedProviders.length === 0 && (
        <p className="error-message">Выберите хотя бы один AI провайдер</p>
      )}
    </form>
  );
};