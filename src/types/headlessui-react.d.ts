declare module "@headlessui/react" {
  // Re-export Disclosure type to fix incorrect path resolution with TS bundler module resolution.
  import {
    Disclosure as _Disclosure,
    DisclosureButton as _DisclosureButton,
    DisclosurePanel as _DisclosurePanel,
  } from "@headlessui/react/dist/components/disclosure/disclosure";

  /**
   * The `Disclosure` component from Headless UI.
   * This re-export exists to work around a TypeScript path resolution quirk
   * when `moduleResolution` is set to `bundler` (TS 5.0+).
   */
  export const Disclosure: typeof _Disclosure & {
    Button: typeof _DisclosureButton;
    Panel: typeof _DisclosurePanel;
  };

  export * from "@headlessui/react/dist/index";
}
