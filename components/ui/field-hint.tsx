import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FieldHint({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm leading-6 text-[color:var(--muted-foreground)]", className)}>
      {children}
    </p>
  );
}
