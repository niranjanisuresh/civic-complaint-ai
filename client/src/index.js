// client/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // 👈 This MUST match the exact case and file name
import reportWebVitals from './reportWebVitals';

// 🧠 Grab the <div id="root"></div> from client/public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional performance reporting
reportWebVitals();
