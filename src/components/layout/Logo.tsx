import Image from "next/image";

export function Logo({
  compact = false,
  dark = false,
}: {
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${
          compact ? "h-9 w-9" : "h-12 w-12"
        } ${dark ? "bg-black" : "bg-[#0a0a0a]"}`}
      >
        <Image
          src="/logo-redfoxa.png"
          alt="RedFoxa Careerlink Pvt Ltd"
          fill
          className="object-cover"
          sizes="48px"
          priority
        />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide text-brand-red">REDFOXA</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-red/75">
            Careerlink Pvt Ltd
          </p>
        </div>
      )}
    </div>
  );
}
