// "use client" // Not needed in Vite, kept for parity

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// Minimal cn util to merge classes without shadcn setup
function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "");

  useEffect(() => {
    // no-op here; component relies on Tailwind responsive utilities (md:hidden etc.)
    // kept effect to mirror original behavior without extra listeners
    return () => {};
  }, []);

  return (
    <div className={cn("fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6", className)}>
      <div className="flex items-center gap-3 bg-bg/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <NavLink
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className={({ isActive: isRouteActive }) =>
                cn(
                  "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                  "text-text/80 hover:text-primary",
                  (isActive || isRouteActive) && "bg-bg-muted text-primary"
                )
              }
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
