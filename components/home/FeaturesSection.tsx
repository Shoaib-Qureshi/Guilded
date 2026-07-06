"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const IMG_HANDSHAKE  = "/images/Founder-Only Community.webp";
const IMG_VETTED     = "/images/Carefully vetted members.webp";
const IMG_CIRCLES    = "/images/Curated peer circles.webp";
const IMG_SESSIONS   = "/images/Monthly council sessions.webp";
const IMG_ENGAGEMENT = "/images/High-intent engagement.webp";
const IMG_CONVOS     = "/images/Relevant, niche conversations.webp";

const PATH_D =
  "M642 0C642 56.0569 596.557 101.5 540.5 101.5H157.5C72.4482 101.5 3.5 170.448 3.5 255.5V277" +
  "C3.5 362.052 72.4482 431 157.5 431H1123.5C1208.55 431 1277.5 499.948 1277.5 585V604" +
  "C1277.5 689.052 1208.55 758 1123.5 758H157.5C72.4481 758 3.5 826.948 3.5 912V931" +
  "C3.5 1016.05 72.4482 1085 157.5 1085H1123.5C1208.55 1085 1277.5 1153.95 1277.5 1239V1259.5" +
  "C1277.5 1344.55 1208.55 1413.5 1123.5 1413.5H157.5C72.4481 1413.5 3.5 1482.45 3.5 1567.5V1586.5" +
  "C3.5 1671.55 72.4482 1740.5 157.5 1740.5H1123.5C1208.55 1740.5 1277.5 1809.45 1277.5 1894.5V1914" +
  "C1277.5 1999.05 1208.55 2068 1123.5 2068H785.5C700.448 2068 631.5 2136.95 631.5 2222V2249";

type Feature = {
  title: string;
  description: string;
  image: string;
  circular?: boolean;
  imageRight?: boolean;
};

const FEATURES: Feature[] = [
  {
    title: "Founder-only community",
    description: "Built exclusively for small to mid-sized agency owners and not freelancers, or observers.",
    image: IMG_HANDSHAKE,
    imageRight: false,
  },
  {
    title: "Carefully vetted members",
    description: "Every application is reviewed.",
    image: IMG_VETTED,
    imageRight: true,
  },
  {
    title: "Curated peer circles",
    description: "A private group of 6–8 agency founders, matched by size, stage, and service type.",
    image: IMG_CIRCLES,
    circular: true,
    imageRight: false,
  },
  {
    title: "Monthly council sessions",
    description: "Structured monthly discussions led by a moderator.",
    image: IMG_SESSIONS,
    circular: true,
    imageRight: true,
  },
  {
    title: "High-intent engagement",
    description: "Designed for busy founders to engage when it matters (not every day).",
    image: IMG_ENGAGEMENT,
    imageRight: false,
  },
  {
    title: "Relevant, niche conversations",
    description: "Connect with founders facing similar challenges, clients, and growth stages.",
    image: IMG_CONVOS,
    circular: true,
    imageRight: true,
  },
];

function FeatureRow({ feature }: { feature: Feature }) {
  const imgEl = (
    <div
      className={`relative shrink-0 ${
        feature.circular
          ? "size-[124px] rounded-full overflow-hidden sm:size-[170px] lg:size-[234px]"
          : "size-[132px] sm:size-[180px] lg:size-[249px]"
      }`}
    >
      <Image
        src={feature.image}
        alt=""
        fill
        sizes="249px"
        className="object-cover pointer-events-none"
        aria-hidden
      />
    </div>
  );

  return (
    <div
      className={`relative z-10 flex items-center gap-4 sm:gap-6 lg:gap-7 ${
        feature.imageRight ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {imgEl}
      <div className="flex flex-col gap-1">
        <h3
          className="font-serif font-normal text-guilded-green"
          style={{
            fontSize: "clamp(22px, 4.2vw, 40px)",
            lineHeight: 1.05,
            letterSpacing: "-0.06em",
          }}
        >
          {feature.title}
        </h3>
        <p
          className="font-thin"
          style={{
            fontSize: "clamp(16px, 3.2vw, 32px)",
            lineHeight: "normal",
            letterSpacing: "-0.06em",
            color: "#394817",
            maxWidth: "500px",
          }}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([]);

  /*
   * Below lg the Figma path (drawn for a 1274px layout) distorts badly when
   * stretched: corners squash into ellipses and the line hugs the screen edge.
   * So on smaller screens we rebuild the same serpentine from the measured row
   * positions — true circular corners, proper edge inset — in a viewBox that
   * matches the container 1:1. Desktop keeps the original path untouched.
   */
  const [dynPath, setDynPath] = useState<{ d: string; w: number; h: number } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const K = 0.5523; // cubic-bézier quarter-circle constant

    const build = () => {
      const w = wrap.clientWidth;
      if (w >= 1024) {
        setDynPath(null);
        return;
      }
      const h = wrap.clientHeight;
      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
      if (rows.length < 2) return;

      const wrapTop = wrap.getBoundingClientRect().top;
      const rects = rows.map((el) => {
        const rc = el.getBoundingClientRect();
        return { top: rc.top - wrapTop, bottom: rc.bottom - wrapTop };
      });

      const m  = 12;                                       // inset from container edge
      const e  = rects[0].top * 0.68;                      // entry-curve y (matches Figma ratio)
      const r  = Math.min(Math.max(28, w * 0.12), 48, e * 0.8); // corner radius
      const cx = w / 2;
      const k  = K * r;
      const L  = m + r;
      const R  = w - m - r;

      // Horizontal "bands" the path travels along: midpoint of each gap
      // between rows, plus one below the last row leading to the exit.
      const bands: number[] = [];
      for (let i = 0; i < rects.length - 1; i++) {
        bands.push((rects[i].bottom + rects[i + 1].top) / 2);
      }
      const last = rects[rects.length - 1];
      bands.push(last.bottom + (h - last.bottom) * 0.45);

      // Entry: top centre, quarter-turn left, U-turn down the left edge into band 0
      let d = `M${cx} 0 L${cx} ${e - r}`;
      d += ` C${cx} ${e - r + k} ${cx - r + k} ${e} ${cx - r} ${e}`;
      d += ` L${L} ${e}`;
      d += ` C${L - k} ${e} ${m} ${e + r - k} ${m} ${e + r}`;
      d += ` L${m} ${bands[0] - r}`;
      d += ` C${m} ${bands[0] - r + k} ${L - k} ${bands[0]} ${L} ${bands[0]}`;

      // Serpentine: band i heads right when i is even, left when odd
      for (let i = 0; i < bands.length - 1; i++) {
        const y = bands[i];
        const ny = bands[i + 1];
        if (i % 2 === 0) {
          d += ` L${R} ${y}`;
          d += ` C${R + k} ${y} ${w - m} ${y + r - k} ${w - m} ${y + r}`;
          d += ` L${w - m} ${ny - r}`;
          d += ` C${w - m} ${ny - r + k} ${R + k} ${ny} ${R} ${ny}`;
        } else {
          d += ` L${L} ${y}`;
          d += ` C${L - k} ${y} ${m} ${y + r - k} ${m} ${y + r}`;
          d += ` L${m} ${ny - r}`;
          d += ` C${m} ${ny - r + k} ${L - k} ${ny} ${L} ${ny}`;
        }
      }

      // Exit: quarter-turn from the last band down to the bottom centre
      const by = bands[bands.length - 1];
      if ((bands.length - 1) % 2 === 1) {
        // last band heads left → turn down at centre from the right
        d += ` L${cx + r} ${by}`;
        d += ` C${cx + r - k} ${by} ${cx} ${by + r - k} ${cx} ${by + r}`;
      } else {
        // last band heads right → turn down at centre from the left
        d += ` L${cx - r} ${by}`;
        d += ` C${cx - r + k} ${by} ${cx} ${by + r - k} ${cx} ${by + r}`;
      }
      d += ` L${cx} ${h}`;

      setDynPath({ d, w, h });
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const path    = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    // pathLength="1" normalises dasharray/offset to [0,1]
    path.style.strokeDasharray  = "1";
    path.style.strokeDashoffset = "1";

    const update = () => {
      const { top, height } = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      /*
       * Three phases:
       *
       * 1. ENTRY  — section top crosses the bottom half of the viewport.
       *             Draw 0 → 15% so the path tip is already visible when
       *             the first feature row comes into view.
       *
       * 2. INSIDE — user is scrolling through the content.
       *             Draw 15 → 100% linearly as the section scrolls past.
       *             Completes exactly when section bottom reaches viewport bottom.
       *
       * 3. EXIT   — section has scrolled past; clamp at 100%.
       */

      // Trigger entry when section top crosses 80% down the viewport
      const ENTRY_START = viewH * 0.8; // rect.top value at which entry begins
      const ENTRY_FRAC  = 0.15;        // fraction of path drawn during entry

      let p: number;

      if (top > ENTRY_START) {
        // Section not yet at trigger point
        p = 0;
      } else if (top > 0) {
        // Entry phase: top has crossed ENTRY_START but is still in viewport
        p = ((ENTRY_START - top) / ENTRY_START) * ENTRY_FRAC;
      } else {
        // Inside / exit phase: top has gone above viewport top
        const scrolledPast   = -top;                   // px scrolled past section top
        const scrollableZone = height - viewH;         // total "inside" scroll distance
        const insideP        = Math.min(1, scrolledPast / scrollableZone);
        p = ENTRY_FRAC + insideP * (1 - ENTRY_FRAC);
      }

      path.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, p)));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-guilded-cream">
      <h2
        className="pt-12 text-center font-serif font-normal text-guilded-green md:pt-20"
        style={{
          fontSize: "clamp(40px, 5vw, 64px)",
          lineHeight: 1.4,
          letterSpacing: "-0.06em",
        }}
      >
        Inside Guilded
      </h2>

      <div ref={wrapRef} className="relative mx-auto max-w-[1274px] px-6 lg:px-16">
        {/* Inline SVG — scroll-driven stroke draw */}
        <svg
          viewBox={dynPath ? `0 0 ${dynPath.w} ${dynPath.h}` : "0 0 1281 2249"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="path-gradient"
              x1={dynPath ? 0 : 3.5004}
              y1={dynPath ? dynPath.h / 2 : 1124.5}
              x2={dynPath ? dynPath.w : 1277.5}
              y2={dynPath ? dynPath.h / 2 : 1124.5}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D6AE5F" />
              <stop offset="0.1012" stopColor="#D9B162" />
              <stop offset="0.1736" stopColor="#E2BA6B" />
              <stop offset="0.2171" stopColor="#ECC475" />
              <stop offset="0.2544" stopColor="#E4BC6D" />
              <stop offset="0.3126" stopColor="#CEA657" />
              <stop offset="0.3839" stopColor="#AA8233" />
              <stop offset="0.4067" stopColor="#9D7526" />
              <stop offset="0.4728" stopColor="#AC8435" />
              <stop offset="0.5496" stopColor="#C29A4B" />
              <stop offset="0.6738" stopColor="#D6AE5F" />
              <stop offset="0.877"  stopColor="#FED687" />
              <stop offset="0.9214" stopColor="#E6BE6F" />
              <stop offset="0.9673" stopColor="#D4AC5D" />
              <stop offset="1"      stopColor="#CDA556" />
            </linearGradient>
          </defs>
          {/* non-scaling-stroke keeps the line a uniform thickness when the
              SVG is stretched non-uniformly on smaller screens */}
          <path
            ref={pathRef}
            d={dynPath ? dynPath.d : PATH_D}
            stroke="url(#path-gradient)"
            strokeWidth="7"
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            className="stroke-[3px] sm:stroke-[4.5px] lg:stroke-[7px]"
          />
        </svg>

        {/* Spacing scales with the image sizes (132px → 180px → 249px) so the
            row/gap proportions match the desktop layout the path was drawn for.
            pb = Figma gap between last feature row bottom and path endpoint */}
        <div className="relative flex flex-col gap-12 pt-[80px] pb-[122px] sm:gap-16 sm:pt-[108px] sm:pb-[166px] lg:gap-[88px] lg:pt-[150px] lg:pb-[230px]">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
            >
              <FeatureRow feature={f} />
            </div>
          ))}
        </div>
      </div>

      {/* Button is a sibling AFTER the path container — its top edge is the path endpoint */}
      <div className="relative z-10 flex justify-center mt-3 pb-12">
        <Link
          href="/onboarding"
          className="rounded-[10px] bg-guilded-gold px-[35px] py-[10px] font-light text-[22px] text-guilded-cream tracking-[-0.06em] transition-opacity hover:opacity-80 md:text-[28px]"
        >
          Join now
        </Link>
      </div>
    </section>
  );
}
