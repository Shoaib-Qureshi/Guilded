"use client";

import { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  name?: string;
};

const TRIGGER_CLS =
  "bg-[#d6ccb3] border border-[#261a0f] rounded-[15px] pl-[32px] pr-[8px] py-[10px] h-auto w-full " +
  "flex items-center justify-between gap-2 " +
  "font-thin text-[20px] tracking-[-0.06em] cursor-pointer text-left";

export function CustomSelect({ options, value, onChange, onBlur, placeholder, name }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [onBlur]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger — looks identical to other inputs */}
      <button
        type="button"
        name={name}
        onClick={() => setOpen((v) => !v)}
        className={TRIGGER_CLS}
        style={{ color: value ? "#261a0f" : "rgba(38,26,15,0.4)" }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>

        {/* Gold dropdown indicator box */}
        <span
          className="shrink-0 bg-guilded-gold rounded-[6px] flex items-center justify-center"
          style={{ width: 22, height: 21 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/svg/select Drop down arrow Vector.svg"
            alt=""
            className="w-[13px]"
            style={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
            }}
          />
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="guilded-dropdown-scroll absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[280px] overflow-y-auto rounded-[15px] border border-[#cdae82]/40 bg-guilded-green shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={
                "w-full cursor-pointer px-[32px] py-[10px] text-left font-thin text-[20px] " +
                "tracking-[-0.06em] transition-colors " +
                (opt.value === value
                  ? "bg-[#1a3830] text-guilded-cream"
                  : "text-guilded-cream hover:bg-[#1a3830]")
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
