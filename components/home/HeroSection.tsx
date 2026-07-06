import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[560px] w-full items-center justify-center overflow-hidden bg-guilded-green md:min-h-[750px]">
      {/* Hero texture overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-lighten">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
          aria-hidden
        />
      </div>

      {/* Radial gradient vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(15,38,33,1) 0%, rgba(15,38,33,0.24) 100%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-[11px] px-6 text-center">
        <h1
          className="font-serif font-normal text-guilded-cream"
          style={{
            fontSize: "clamp(44px, 6.67vw, 96px)",
            lineHeight: 0.86,
            letterSpacing: "-0.06em",
          }}
        >
          Your craft
          <br />
          deserves a{" "}
          <em className="not-italic font-semibold italic">council.</em>
        </h1>

        {/* CTA buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-[10px]">
          <Link
            href="/#how-it-works"
            className="rounded-[14px] border border-guilded-gold bg-guilded-cream px-[22px] py-[7px] font-thin text-[18px] text-guilded-gold tracking-[-0.06em] transition-opacity hover:opacity-80 md:text-[22px]"
          >
            How it works
          </Link>
          <Link
            href="/onboarding"
            className="rounded-[14px] bg-guilded-gold px-[22px] py-[7px] font-thin text-[18px] text-guilded-cream tracking-[-0.06em] transition-opacity hover:opacity-80 md:text-[22px]"
          >
            Join now
          </Link>
        </div>

        <p className="mt-1 font-thin text-[14px] tracking-[-0.06em]" style={{ color: "#bfb396" }}>
          Membership is extended by application.
        </p>
      </div>
    </section>
  );
}
