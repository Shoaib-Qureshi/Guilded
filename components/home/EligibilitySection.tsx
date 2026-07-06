import Image from "next/image";

const IMG_FRAME = "/images/eligibility frame.webp";

const CRITERIA = [
  "You founded and run your agency",
  "You have 2 to 50 employees",
  "Guilded is designed for small to mid-sized agency owners",
  "You have at least one year of trading experience",
];

function CriteriaCard({ text }: { text: string }) {
  return (
    <div className="relative flex size-[305px] shrink-0 snap-center flex-col items-center justify-center rounded-[25px] bg-guilded-green px-2 py-6">
      {/* Ornamental frame — 352×352, offset -26px left, -23px top */}
      <div
        className="pointer-events-none absolute size-[352px]"
        style={{ left: -26, top: -23 }}
        aria-hidden
      >
        <Image src={IMG_FRAME} alt="" fill sizes="352px" className="object-cover" />
      </div>
      <p
        className="relative z-10 text-center font-normal text-guilded-cream"
        style={{ fontSize: "28px", lineHeight: "normal", letterSpacing: "-0.06em", maxWidth: "200px" }}
      >
        {text}
      </p>
    </div>
  );
}

export function EligibilitySection() {
  return (
    <section className="relative w-full overflow-hidden border-t-8 border-[#d6ae5f] bg-guilded-cream py-16">
      {/* Tessellated background SVG */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/svg/eligibility bg.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full object-cover select-none"
      />

      <div className="relative flex flex-col items-center gap-10 lg:gap-[66px]">
        <h2
          className="px-4 text-center font-serif font-normal text-guilded-green"
          style={{
            fontSize: "clamp(44px, 7.5vw, 96px)",
            lineHeight: 1.05,
            letterSpacing: "-0.06em",
          }}
        >
          Eligibility Criteria
        </h2>

        {/* Carousel: horizontal snap-scroll when the row (1313px + frame padding) overflows;
            ≥1380px everything fits and the row centres — identical to the original layout.
            Padding: 26px sides / 23px top / 24px bottom = ornamental frame overflow beyond the 305px cards */}
        <div
          className="flex w-full snap-x snap-mandatory items-center gap-[31px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[1380px]:justify-center"
          style={{ paddingLeft: 26, paddingRight: 26, paddingTop: 23, paddingBottom: 24 }}
        >
          {CRITERIA.map((text) => (
            <CriteriaCard key={text} text={text} />
          ))}
        </div>
      </div>
    </section>
  );
}
