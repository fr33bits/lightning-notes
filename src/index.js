import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { UserProvider } from './context/UserContext';
import { StreamProvider } from './context/StreamContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <StreamProvider>
        <App />
      </StreamProvider>
    </UserProvider>
  </React.StrictMode>
);