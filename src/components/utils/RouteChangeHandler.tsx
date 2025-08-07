import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * @module src/components/utils/RouteChangeHandler.tsx
 * @description Утилитарный компонент, который отслеживает изменения URL с помощью хука `useLocation` из `react-router-dom`. При каждом изменении пути (`location.pathname`) он может выполнять определенные действия. Компонент не рендерит ничего в DOM (возвращает `null`).
 * @author Kort
 * @version 1.1.0
 * @usage
 * 1. `src/App.tsx`: Используется для отслеживания смены маршрута.
 * @example
 * return (
 *   <Router>
 *     <RouteChangeHandler />
 *     // ... остальные маршруты
 *   </Router>
 * );
 */
const RouteChangeHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Эта функция будет вызываться при каждом изменении маршрута.
    // Здесь можно будет добавить необходимую логику в будущем,
    // например, для аналитики или закрытия меню.
  }, [location.pathname]);

  return null;
};

export default RouteChangeHandler;
