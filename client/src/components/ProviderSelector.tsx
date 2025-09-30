import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProviders, toggleProvider } from '../store/slices/aiSlice';

export const ProviderSelector = () => {
  const dispatch = useAppDispatch();
  const { providers, selectedProviders } = useAppSelector(state => state.ai);

  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  return (
    <div className="provider-selector">
      <h3>Выберите AI модели:</h3>
      <div className="providers-list">
        {providers.map(provider => (
          <label key={provider.id} className="provider-item">
            <input
              type="checkbox"
              checked={selectedProviders.includes(provider.id)}
              onChange={() => dispatch(toggleProvider(provider.id))}
              disabled={!provider.available}
            />
            <span className={!provider.available ? 'disabled' : ''}>
              {provider.name}
              {!provider.available && ` (${provider.reason})`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};