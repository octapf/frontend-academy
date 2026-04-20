"use client";

import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  children?: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center rounded-lg font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-zinc-900 hover:bg-brand/90",
  secondary:
    "border border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-900/5 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-100/10",
  ghost:
    "text-zinc-900 hover:bg-zinc-900/5 dark:text-zinc-100 dark:hover:bg-zinc-100/10",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  asChild = false,
  type,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error("Button with asChild expects a single React element child.");
    }
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button
      type={type ?? "button"}
      className={classes}
      {...props}
    />
  );
}

