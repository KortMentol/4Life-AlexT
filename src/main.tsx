import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './styles/index.css';
import './styles/fixes.css';
import './styles/animations.css';
import './styles/modern-design.css';
import './styles/menu-animations.css';

// Функция для инициализации приложения
const initApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <ThemeProvider>
            <ParallaxProvider>
              <App />
            </ParallaxProvider>
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Запускаем приложение
initApp();