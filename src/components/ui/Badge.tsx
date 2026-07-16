import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "red",
  className,
}: {
  children: React.ReactNode;
  tone?: "red" | "blue" | "green" | "orange" | "gray" | "purple";
  className?: string;
}) {
  const tones = {
    red: "bg-[#FCE8EB] text-[#A31D31]",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
    gray: "bg-gray-100 text-gray-600",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
