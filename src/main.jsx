import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { RecordProvider } from './context/RecordContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecordProvider>
      <App />
    </RecordProvider>
  </React.StrictMode>,
);
