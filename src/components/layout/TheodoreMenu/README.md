# Модуль: TheodoreMenu

## @description

TheodoreMenu — это полноэкранное мобильное меню с уникальной SVG-анимацией открытия/закрытия и фоном из бесконечно движущихся плиток с изображениями. Этот компонент является глубокой адаптацией и интеграцией в React/Vite/TypeScript проект демо-версии "Theodore" от Codrops.

## @author

Kort (адаптация), Codrops (оригинальная концепция и анимация)

## @version

1.0.0

## @see

- Оригинальное демо: [Theodore by Codrops](http://tympanus.net/Development/Theodore/)
- `src/components/layout/Header.tsx`: Компонент, который управляет состоянием (открытием/закрытием) этого меню.

## Основные технологии и зависимости

- **GSAP (GreenSock Animation Platform):** Используется для сложной и производительной анимации SVG-path оверлея и хореографии появления/исчезновения элементов меню.
- **React Router (`Link`):** Для навигации по ссылкам внутри меню.
- **Динамические импорты:** Изображения для фона подгружаются как статические ассеты для оптимизации сборки Vite.

## Особенности реализации

- **SVG Overlay Animation:** Анимация перехода основана на морфинге `d` атрибута SVG-элемента `<path>`, что создает органичный "волновой" эффект.
- **Infinite Background:** Бесконечная прокрутка фона с изображениями реализована с помощью чистой CSS-анимации (`@keyframes slide`), что обеспечивает высокую производительность и не нагружает основной поток JavaScript.
- **State Management:** Состояние `isOpen` полностью контролируется родительским компонентом (`Header.tsx`) через пропсы, что делает `TheodoreMenu` презентационным компонентом.

## @usage

Компонент импортируется в `src/components/layout/Header.tsx`. Его видимостью управляет состояние `isMenuOpen`.

```tsx
// в src/components/layout/Header.tsx
import TheodoreMenu from "./TheodoreMenu";

const [isMenuOpen, setIsMenuOpen] = useState(false);

<TheodoreMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />;
```
