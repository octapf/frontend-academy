"use client";

import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-200 px-3 py-2 text-sm outline-none",
        "focus:ring-2 focus:ring-brand/60 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:ring-brand/50",
        className
      )}
      {...props}
    />
  );
}

