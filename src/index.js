import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { UserProvider } from './context/UserContext';
import { StreamProvider } from './context/StreamContext';
import { ViewProvider } from './context/ViewContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <ViewProvider>
        <StreamProvider>
          <App />
        </StreamProvider>
      </ViewProvider>
    </UserProvider>
  </React.StrictMode>
);