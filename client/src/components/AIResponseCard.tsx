import type { AIResponse } from '../types';

interface AIResponseCardProps {
  response: AIResponse;
}

export const AIResponseCard = ({ response }: AIResponseCardProps) => {
  const copyToClipboard = () => {
    if (response.response) {
      navigator.clipboard.writeText(response.response);
    }
  };

  return (
    <div className={`response-card ${response.status}`}>
      <div className="card-header">
        <h3>{response.provider}</h3>
        <span className="execution-time">{response.executionTime}ms</span>
      </div>
      <div className="card-model">
        <span className="model-name">{response.model}</span>
      </div>
      <div className="card-content">
        {response.status === 'loading' && (
          <div className="loading-spinner">Загрузка...</div>
        )}
        {response.status === 'success' && response.response && (
          <>
            <p className="response-text">{response.response}</p>
            <button onClick={copyToClipboard} className="copy-button">
              Копировать
            </button>
          </>
        )}
        {response.status === 'error' && (
          <div className="error-content">
            <p className="error-text">Ошибка: {response.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};