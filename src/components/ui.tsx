import type { ComponentProps } from "react";

type Variant = "primary" | "quiet" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-sans text-[0.95rem] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-ultra text-white hover:bg-ultra-strong dark:text-night",
  quiet: "border border-rule text-ink hover:border-ink",
  danger: "bg-danger text-white hover:opacity-90 dark:text-night",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function Button({ variant = "primary", className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`} {...props} />;
}

export const fieldClass =
  "w-full rounded-xl border border-rule bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-slate/70 focus:border-ultra focus:outline-none";

export const labelClass = "mb-1.5 block font-sans text-sm font-medium text-ink";
