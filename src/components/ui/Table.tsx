import { cn } from "@/lib/utils";

export function Table({
  headers,
  children,
  className,
}: {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-auto rounded-xl border border-gray-200 bg-white", className)}>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-[#E8F0FE] text-gray-800">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}
