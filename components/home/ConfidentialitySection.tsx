import Image from "next/image";

const IMG_PADLOCK = "/images/gold lock.webp";

export function ConfidentialitySection() {
  return (
    <section className="relative w-full">
      {/* Cream bridge — 215px matches Figma; padlock sits here (top 145px of lock) */}
      <div className="h-[140px] w-full bg-guilded-cream md:h-[215px]" />

      {/* Dark olive band with gold borders */}
      <div className="relative border-t-8 border-b-8 border-[#cca455] bg-[#394817]">
        {/* pt clears the padlock overhang into the band (minus 8px border) */}
        <div className="flex flex-col items-center px-6 pt-[65px] pb-14 md:pt-[95px] md:pb-[86px]">
          <h2
            className="text-center font-serif font-normal text-guilded-cream"
            style={{
              fontSize: "clamp(40px, 7.5vw, 96px)",
              lineHeight: 1.05,
              letterSpacing: "-0.06em",
              maxWidth: "1052px",
            }}
          >
            What&apos;s spoken in session, leaves no record.
          </h2>
        </div>
      </div>

      {/* Padlock — absolutely positioned (Figma: top 70px, 218×248), straddles the gold border */}
      <div className="absolute top-[45px] left-1/2 z-10 h-[159px] w-[140px] -translate-x-1/2 md:top-[70px] md:h-[248px] md:w-[218px]">
        <Image src={IMG_PADLOCK} alt="" fill sizes="218px" className="object-cover" />
      </div>
    </section>
  );
}
