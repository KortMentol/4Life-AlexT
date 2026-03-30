declare module "@headlessui/react" {
  // Re-export components to fix incorrect path resolution with TS bundler module resolution.
  import {
    Dialog as _Dialog,
    DialogPanel as _DialogPanel,
    DialogTitle as _DialogTitle,
    Transition as _Transition,
    TransitionChild as _TransitionChild,
  } from "@headlessui/react/dist/components/dialog/dialog";

  import {
    Disclosure as _Disclosure,
    DisclosureButton as _DisclosureButton,
    DisclosurePanel as _DisclosurePanel,
  } from "@headlessui/react/dist/components/disclosure/disclosure";

  /**
   * Dialog and Transition components from Headless UI.
   * Used in ProductListIcon for modal window.
   */
  export const Dialog: typeof _Dialog & {
    Panel: typeof _DialogPanel;
    Title: typeof _DialogTitle;
  };

  export const Transition: typeof _Transition & {
    Child: typeof _TransitionChild;
  };

  /**
   * Disclosure component from Headless UI.
   */
  export const Disclosure: typeof _Disclosure & {
    Button: typeof _DisclosureButton;
    Panel: typeof _DisclosurePanel;
  };

  export * from "@headlessui/react/dist/index";
}
