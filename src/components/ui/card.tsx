import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
};

export function Card({
  as: Component = "section",
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "flex flex-col gap-3 border-t border-border pt-6",
        className,
      )}
      {...props}
    />
  );
}
