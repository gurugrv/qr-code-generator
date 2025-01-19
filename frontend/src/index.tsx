import React from 'react';
import ReactDOM from 'react-dom/client';
import { initErrorReporting } from './services/errorReporting';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import App from './App';
import { store, persistor } from './store/store';
import { QRCodeProvider } from './context/QRCodeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Check for dark mode preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

initErrorReporting();

// Create loading component
const LoadingView = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);


try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Failed to find root element');
  }

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ErrorBoundary dispatch={store.dispatch}>
        <Provider store={store}>
          {persistor ? (
            <PersistGate 
              loading={<LoadingView />} 
              persistor={persistor}
            onBeforeLift={() => {
              return new Promise((resolve, reject) => {
                try {
                  // Verify initial state is valid
                  const state = store.getState();
                  if (!state) {
                    throw new Error('Store state is invalid');
                  }
                  // Add small delay to ensure storage is ready
                  setTimeout(resolve, 100);
                } catch (error) {
                  reject(error);
                }
              });
            }}
          >
            <QRCodeProvider>
              <App />
            </QRCodeProvider>
            </PersistGate>
          ) : (
            // Render app without persistence if persistor is null
            <QRCodeProvider>
              <App />
            </QRCodeProvider>
          )}
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  const { reportError } = require('./services/errorReporting');
  reportError({
    message: 'Failed to initialize React app',
    stack: error instanceof Error ? error.stack : undefined
  });
  // Render minimal error UI
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem;">
        <div style="background:#FEE2E2;padding:1rem;border-radius:0.5rem;max-width:32rem;">
          <h2 style="color:#991B1B;font-size:1.125rem;font-weight:600;margin-bottom:0.5rem;">
            Failed to load application
          </h2>
          <p style="color:#B91C1C;font-size:0.875rem;">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
        </div>
      </div>
    `;
  }
}
