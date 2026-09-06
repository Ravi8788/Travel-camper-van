import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-lg border bg-sand-50 px-4 text-sm text-ink shadow-inner shadow-ink/5",
        "placeholder:text-sand-400",
        "transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-500 focus-visible:ring-2 focus-visible:ring-accent-100",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand-100",
        error ? "border-error focus-visible:outline-error" : "border-sand-300 hover:border-sand-400",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border bg-sand-50 px-4 py-3 text-sm text-ink shadow-inner shadow-ink/5",
        "placeholder:text-sand-400",
        "transition-colors duration-200 resize-y",
        "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-500 focus-visible:ring-2 focus-visible:ring-accent-100",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand-100",
        error ? "border-error focus-visible:outline-error" : "border-sand-300 hover:border-sand-400",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-lg border bg-sand-50 px-4 text-sm text-ink",
        "transition-colors duration-200 appearance-none",
        "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-500",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand-100",
        error ? "border-error" : "border-sand-300 hover:border-sand-400",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
);

Select.displayName = "Select";
