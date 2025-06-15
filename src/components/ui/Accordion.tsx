import { Disclosure, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React from "react";

export interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      {items.map((item) => (
        <Disclosure key={item.id} as="div" className="mb-4 last:mb-0">
          {({ open }: { open: boolean }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-6 py-4 text-left text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75">
                <span>{item.title}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
                />
              </Disclosure.Button>
              <Transition
                as={motion.div}
                enter="transition duration-200 ease-out"
                enterFrom="transform scale-y-95 opacity-0"
                enterTo="transform scale-y-100 opacity-100"
                leave="transition duration-150 ease-in"
                leaveFrom="transform scale-y-100 opacity-100"
                leaveTo="transform scale-y-95 opacity-0"
              >
                <Disclosure.Panel className="px-6 pt-4 pb-6 rounded-b-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                  {item.content}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default Accordion;
