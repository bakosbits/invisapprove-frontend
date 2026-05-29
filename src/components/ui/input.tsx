import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-slate-400">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "h-9 w-full rounded-input border border-invisapprove-border bg-invisapprove-surface px-3 text-sm text-slate-100 placeholder:text-slate-600",
            "transition-colors focus:outline-none focus:border-invisapprove-primary focus:ring-1 focus:ring-invisapprove-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-slate-400">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "min-h-[80px] w-full rounded-input border border-invisapprove-border bg-invisapprove-surface px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 resize-y",
            "transition-colors focus:outline-none focus:border-invisapprove-primary focus:ring-1 focus:ring-invisapprove-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
