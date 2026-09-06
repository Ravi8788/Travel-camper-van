"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

interface AccordionContextValue {
  openItems: string[];
  toggle: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within Accordion");
  return ctx;
}

export function Accordion({
  children,
  allowMultiple = false,
  defaultOpen = [],
  className,
}: {
  children: ReactNode;
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, allowMultiple }}>
      <div className={cn("divide-y divide-sand-200 border border-sand-200 rounded-2xl overflow-hidden", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const { openItems, toggle } = useAccordion();
  const isOpen = openItems.includes(id);

  return (
    <div className={cn("bg-white", className)}>
      <button
        type="button"
        id={`accordion-trigger-${id}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        onClick={() => toggle(id)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-ink hover:bg-sand-50 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-sand-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={`accordion-panel-${id}`}
        role="region"
        aria-labelledby={`accordion-trigger-${id}`}
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 text-sm text-sand-500 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
