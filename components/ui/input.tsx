"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 text-sm text-[color:var(--foreground)] shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none transition placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--border-strong)] focus:ring-4 focus:ring-[color:var(--ring-soft)] dark:bg-white/5",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
