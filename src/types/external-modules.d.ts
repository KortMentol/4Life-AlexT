/*
  Custom module declarations for packages missing type definitions or with path export issues.
  This allows TypeScript to compile smoothly while still benefiting from package-provided types
  when they are available.
*/

declare module "@heroicons/react/24/solid" {
  // Provide the subset of icons that our project relies on. Using `any` keeps the
  // declarations simple while still allowing correct imports.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ClipboardDocumentListIcon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const XMarkIcon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const TrashIcon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const PaperAirplaneIcon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const PlusIcon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const MinusIcon: any;
}

// Swiper CSS imports
declare module "swiper/css";
declare module "swiper/css/effect-cube";
declare module "swiper/css/pagination";
