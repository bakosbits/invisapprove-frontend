import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-input text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-invisapprove-primary focus-visible:ring-offset-2 focus-visible:ring-offset-invisapprove-bg disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-invisapprove-primary text-white hover:bg-invisapprove-primary-hover active:scale-[0.98]",
        ghost:
          "text-slate-300 hover:bg-invisapprove-muted hover:text-white",
        outline:
          "border border-invisapprove-border text-slate-300 hover:bg-invisapprove-surface-raised hover:text-white",
        destructive:
          "bg-rose-600/20 text-rose-400 border border-rose-600/30 hover:bg-rose-600/30 hover:text-rose-300",
        subtle:
          "bg-invisapprove-primary-subtle text-indigo-300 hover:bg-invisapprove-primary/20",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-6 text-base",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
