import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent",
        className,
      )}
      {...props}
    />
  );
}
