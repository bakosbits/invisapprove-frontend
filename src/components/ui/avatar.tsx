import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../lib/cn";

interface AvatarProps extends AvatarPrimitive.AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-11 w-11 text-base" };

export function Avatar({ src, name, size = "md", className, ...props }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name ?? "Avatar"}
          className="h-full w-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-invisapprove-primary font-medium text-white">
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
