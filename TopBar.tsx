"use client";

import { useEffect, useState } from "react";

const inset = {
  top: "max(1rem, env(safe-area-inset-top))",
  left: "max(1rem, env(safe-area-inset-left))",
  right: "max(1rem, env(safe-area-inset-right))",
};

function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return now;
}

function useListenerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(120 + Math.floor(Math.random() * 60));
    const id = setInterval(() => {
      setCount((c) => {
        if (c === null) return c;
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(40, c + delta);
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return count;
}

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export default function TopBar() {
  const now = useClock();
  const listeners = useListenerCount();

  const timeLabel = now
    ? now.toLocaleTimeString("bn-IN", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <div className="fixed inset-x-0 top-0 z-30 flex items-start justify-between px-0 text-white">
      <div
        className="fixed text-xs font-medium tabular-nums text-white/80 sm:text-sm"
        style={{ top: inset.top, left: inset.left }}
      >
        {timeLabel}
      </div>

      <div
        className="fixed left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-white/70 sm:text-sm"
        style={{ top: inset.top }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span className="tabular-nums">
          {listeners !== null ? listeners.toLocaleString("bn-IN") : "···"}
        </span>
        <span className="hidden sm:inline">জন শুনছে</span>
      </div>

      <div
        className="fixed flex items-center gap-3 text-xs text-white/70 sm:text-sm"
        style={{ top: inset.top, right: inset.right }}
      >
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
