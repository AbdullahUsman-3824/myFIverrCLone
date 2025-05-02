// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StateProvider } from './context/statecontext';
import { CookiesProvider } from 'react-cookie';

// Wrap the App component with StateProvider and CookiesProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider>
      <StateProvider>
        <App />
      </StateProvider>
    </CookiesProvider>
  </React.StrictMode>
);
