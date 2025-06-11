import React from "react";
import { useTheme } from "../context/useTheme";

// Обновляем импорт useTheme
const Header: React.FC = () => {
  const { theme } = useTheme();

  return (
    <header>
      <h1>Header - {theme}</h1>
    </header>
  );
};

export default Header;
