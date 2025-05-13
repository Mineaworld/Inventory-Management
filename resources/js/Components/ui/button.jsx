import * as React from "react";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  as,
  ...props 
}, ref) => {
  // If asChild is true, use the provided 'as' component or fallback to button
  const Comp = asChild ? (as || "button") : "button";
  
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all duration-150",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    link: "underline-offset-4 hover:underline text-primary",
    outline: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-gray-800",
  };

  const sizeStyles = {
    default: "h-9 px-4 py-2",
    sm: "h-7 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };

  const variantStyle = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.default;

  return (
    <Comp
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary
        disabled:pointer-events-none disabled:opacity-50
        ${variantStyle} ${sizeStyle} ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button }; 