import Link from "next/link";
import { cn } from "@/lib/utils";
import { GuildedLogo } from "@/components/shared/GuildedLogo";

type Props = {
  className?: string;
};

export function GuildedNav({ className }: Props) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-[76px] w-full items-center justify-between",
        "border-b-[3px] border-guilded-gold-border bg-guilded-green px-5 sm:px-10 lg:px-[81px]",
        className
      )}
    >
      <GuildedLogo />

      <nav className="flex items-center gap-4 sm:gap-6 lg:gap-[39px]">
        <Link
          href="/#about"
          className="font-light text-[16px] text-guilded-cream tracking-[-0.06em] transition-opacity hover:opacity-70"
        >
          About
        </Link>

        <Link
          href="/onboarding"
          className="rounded-[10px] bg-guilded-gold px-[25px] py-[8px] font-light text-[16px] text-guilded-cream tracking-[-0.06em] transition-opacity hover:opacity-80"
        >
          Join now
        </Link>

        <Link
          href="/login"
          className="font-light text-[16px] text-guilded-cream tracking-[-0.06em] transition-opacity hover:opacity-70"
        >
          Log in
        </Link>
      </nav>
    </header>
  );
}
