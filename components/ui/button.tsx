import * as React from "react";

import { cn } from "@/lib/utils";

const variantClasses = {
  primary:
    "bg-[color:var(--accent-strong)] text-white shadow-[0_12px_32px_rgba(17,24,39,0.16)] hover:bg-[color:var(--accent-stronger)]",
  secondary:
    "bg-[color:var(--surface)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-strong)]",
  outline:
    "border border-[color:var(--border-strong)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface)]",
  ghost:
    "bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface)]",
} as const;

const sizeClasses = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 px-3.5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "size-11 p-0",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}

export function buttonVariants({
  variant = "primary",
  size = "default",
  className,
}: {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
