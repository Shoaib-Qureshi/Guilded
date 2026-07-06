export function SuccessScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-8 text-center">
      {/* Gold diamond */}
      <div className="-rotate-45 size-[48px] rounded-[13px] bg-guilded-gold" />

      <div className="flex flex-col gap-4" style={{ maxWidth: 640 }}>
        <h2
          className="font-serif font-normal text-guilded-cream"
          style={{ fontSize: "64px", lineHeight: "68px", letterSpacing: "-0.06em" }}
        >
          Application<br />Received.
        </h2>
        <p
          className="font-thin text-guilded-cream/70"
          style={{ fontSize: "20px", lineHeight: "1.5", letterSpacing: "-0.06em" }}
        >
          Thank you for applying to Guilded. We'll review your application and
          be in touch within a few business days.
        </p>
      </div>
    </div>
  );
}
