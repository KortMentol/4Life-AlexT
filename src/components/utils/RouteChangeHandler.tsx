import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface RouteChangeHandlerProps {
  onRouteChange: () => void;
}

/**
 * @module src/components/utils/RouteChangeHandler.tsx
 * @description Утилитарный компонент, который отслеживает изменения URL с помощью хука `useLocation` из `react-router-dom`. При каждом изменении пути (`location.pathname`) он вызывает переданную функцию `onRouteChange`. Компонент не рендерит ничего в DOM (возвращает `null`).
 * @author Kort
 * @version 1.0.0
 * @param {() => void} onRouteChange - Функция обратного вызова, которая будет выполнена при смене маршрута.
 * @usage
 * 1. `src/App.tsx`: Используется для автоматического закрытия мобильного меню при переходе пользователя на новую страницу.
 * @example
 * const handleRouteChange = () => {
 *   console.log('Маршрут изменился!');
 *   // Например, закрыть мобильное меню
 *   // closeMobileMenu();
 * };
 *
 * return (
 *   <Router>
 *     <RouteChangeHandler onRouteChange={handleRouteChange} />
 *     // ... остальные маршруты
 *   </Router>
 * );
 */
const RouteChangeHandler: React.FC<RouteChangeHandlerProps> = ({
  onRouteChange,
}) => {
  const location = useLocation();

  useEffect(() => {
    // Вызываем callback при изменении маршрута
    onRouteChange();
  }, [location.pathname, onRouteChange]);

  // Компонент не рендерит ничего в DOM
  return null;
};

export default RouteChangeHandler;
