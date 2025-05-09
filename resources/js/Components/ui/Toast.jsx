import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

export function ToastProvider({ children, ...props }) {
  return <ToastPrimitive.Provider swipeDirection="right" {...props}>{children}</ToastPrimitive.Provider>;
}

export function ToastRoot({ open, onOpenChange, children, ...props }) {
  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      className="fixed bottom-6 right-6 z-[100] bg-white dark:bg-[#18181b] text-foreground rounded-lg shadow-lg border border-muted px-6 py-4 flex items-center gap-4 min-w-[220px] max-w-xs animate-in fade-in slide-in-from-bottom-4"
      {...props}
    >
      {children}
    </ToastPrimitive.Root>
  );
}

export function ToastTitle({ children }) {
  return <div className="font-semibold text-base mb-1">{children}</div>;
}

export function ToastDescription({ children }) {
  return <div className="text-sm text-muted-foreground">{children}</div>;
}

export function ToastClose({ ...props }) {
  return (
    <ToastPrimitive.Close
      className="ml-auto text-muted-foreground hover:text-primary focus:outline-none"
      aria-label="Close"
      {...props}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </ToastPrimitive.Close>
  );
} 