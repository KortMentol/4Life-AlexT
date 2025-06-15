/*
  Custom module declarations for packages missing type definitions or with path export issues.
  This allows TypeScript to compile smoothly while still benefiting from package-provided types
  when they are available.
*/

declare module "@headlessui/react" {
  // The library ships with its own type definitions, but some build setups with
  // `moduleResolution: bundler` may fail to locate them. We fall back to a very
  // light declaration that exposes the components we actually use so that the
  // rest of the application compiles without complaints. Replace `any` with
  // stricter types if needed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Dialog: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Transition: any;
}

declare module "@heroicons/react/24/outline" {
  // Provide the subset of icons that our project relies on. Using `any` keeps the
  // declarations simple while still allowing correct imports.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ShoppingCartIcon: any;
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
