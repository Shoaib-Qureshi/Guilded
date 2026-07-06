import Link from "next/link";

type Props = {
  className?: string;
};

export function GuildedLogo({ className }: Props) {
  return (
    <Link href="/" className={`flex items-center ${className ?? ""}`}>
      <div className="relative size-[48px] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/svg/Header  logo 1.svg" alt="Guilded" className="w-full h-full object-contain" />
      </div>
    </Link>
  );
}
