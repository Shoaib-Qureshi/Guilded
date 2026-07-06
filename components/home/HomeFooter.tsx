import Image from "next/image";
import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = FooterLink & {
  img: string;
  size: number;
};

const NAV_LINKS: FooterLink[] = [
  { label: "About Us",   href: "/#about" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Pricing",    href: "/#pricing" },
];

const SOCIAL: SocialLink[] = [
  { img: "/svg/linkedin.svg.svg",          label: "LinkedIn",  href: "https://linkedin.com",  size: 24 },
  { img: "/svg/Instagram Vector.svg",      label: "Instagram", href: "https://instagram.com", size: 17 },
  { img: "/svg/X.svg",                     label: "X",         href: "https://x.com",         size: 16 },
];

export function HomeFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-guilded-green border-t-4 border-[#d6ae5f] pt-12 pb-10 md:pt-[76px] md:pb-12">
      {/* Textured background — 17% opacity mosaic/tile pattern */}
      <Image
        src="/images/Footer Bg Image.png"
        alt=""
        fill
        className="pointer-events-none object-cover opacity-[0.17]"
        aria-hidden
        priority={false}
      />

      {/* Top bar: nav links | Join now | social */}
      <div className="relative mx-auto flex max-w-[1302px] flex-col items-center gap-8 px-6 md:flex-row md:justify-between md:gap-0">
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-[71px]">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-normal text-[20px] text-guilded-cream transition-opacity hover:opacity-70"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/onboarding"
          className="rounded-[10px] bg-guilded-gold px-[25px] py-[8px] font-light text-[16px] text-guilded-cream transition-opacity hover:opacity-80"
        >
          Join now
        </Link>

        <div className="flex items-center">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex size-10 items-center justify-center transition-opacity hover:opacity-70"
            >
              <div className="relative" style={{ width: s.size, height: s.size }}>
                <Image src={s.img} alt={s.label} fill sizes="24px" className="object-contain" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Large Guilded wordmark — local SVG file */}
      <div className="relative mx-auto mt-10 flex justify-center px-4 md:mt-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/svg/Footer logo 1.svg"
          alt="Guilded"
          width={1268}
          height={293}
          className="max-w-full"
        />
      </div>
    </footer>
  );
}
