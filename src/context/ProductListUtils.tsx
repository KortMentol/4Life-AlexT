// Utility functions for ProductList context
// Author: Cascade AI
// Date: 2025-06-15
// Purpose: Separate utility functions to avoid react-refresh warnings

export const STORAGE_KEY = "productList4life";

export const loadFromStorage = () => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveToStorage = (items: unknown[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};
