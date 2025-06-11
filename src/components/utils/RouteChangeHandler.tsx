import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface RouteChangeHandlerProps {
  onRouteChange: () => void;
}

/**
 * Компонент для отслеживания изменений маршрута и выполнения действий при изменении
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
