import { cn } from "@/lib/utils";

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initial = name?.charAt(0)?.toUpperCase() || "U";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-red font-semibold text-white",
        size === "sm" && "h-8 w-8 text-xs",
        size === "md" && "h-9 w-9 text-sm",
        size === "lg" && "h-12 w-12 text-lg",
        className
      )}
    >
      {initial}
    </div>
  );
}
