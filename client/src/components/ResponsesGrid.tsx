import { useAppSelector } from '../hooks';
import { AIResponseCard } from './AIResponseCard';

export const ResponsesGrid = () => {
  const { results, loading, error, totalExecutionTime } = useAppSelector(state => state.ai);

  if (loading) {
    return (
      <div className="responses-grid">
        <div className="loading-message">Отправка запросов к AI...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="responses-grid">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="responses-container">
      <div className="results-header">
        <h2>Результаты</h2>
        <span className="total-time">Общее время: {totalExecutionTime}ms</span>
      </div>
      <div className="responses-grid">
        {results.map((response, index) => (
          <AIResponseCard key={`${response.provider}-${index}`} response={response} />
        ))}
      </div>
    </div>
  );
};