import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const setVW = () =>
  document.documentElement.style.setProperty("--vw", `${window.innerWidth}px`);
setVW();
window.addEventListener("resize", setVW);

reportWebVitals();

