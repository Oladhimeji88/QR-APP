import { AlertCircle } from "lucide-react";

export function ValidationMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="flex items-start gap-2 text-sm font-medium text-[color:var(--accent-stronger)]" role="alert">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
