/** @description Ключ для хранения списка продуктов в `localStorage`. */
export const STORAGE_KEY = "productList4life";

/** @description Загружает список продуктов из `localStorage`. В случае отсутствия данных возвращает пустой массив. */
export const loadFromStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

/** @description Сохраняет переданный список продуктов в `localStorage`. */
export const saveToStorage = (items: unknown[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* silent in sandboxed iframes */
  }
};
