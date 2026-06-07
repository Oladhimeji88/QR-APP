"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-32 w-full rounded-3xl border border-[color:var(--border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--foreground)] shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none transition placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--border-strong)] focus:ring-4 focus:ring-[color:var(--ring-soft)] dark:bg-white/5",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
