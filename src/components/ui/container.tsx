import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "main" | "div" | "section";
  size?: "md" | "sm";
};

const sizes = {
  md: "max-w-3xl",
  sm: "max-w-md",
} as const;

export function Container({
  as: Component = "main",
  size = "md",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto flex w-full flex-1 flex-col px-6",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
