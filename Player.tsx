"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { allTracks, playlists } from "@/lib/songs";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listOpen, setListOpen] = useState(false);

  const track = allTracks[trackIndex];

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => next();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }

  function prev() {
    setTrackIndex((i) => (i - 1 + allTracks.length) % allTracks.length);
  }

  function next() {
    setTrackIndex((i) => (i + 1) % allTracks.length);
  }

  function seekTo(clientX: number, rail: HTMLDivElement) {
    const rect = rail.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const audio = audioRef.current;
    if (audio && duration > 0) {
      audio.currentTime = ratio * duration;
      setCurrentTime(audio.currentTime);
    }
  }

  function playTrack(i: number) {
    setTrackIndex(i);
    setIsPlaying(true);
    setListOpen(false);
  }

  return (
    <div className="relative w-full max-w-xl">
      <audio ref={audioRef} src={track.src} preload="metadata" />

      {listOpen && (
        <PlaylistDrawer
          activeId={track.id}
          onSelect={(id) => {
            const i = allTracks.findIndex((t) => t.id === id);
            if (i >= 0) playTrack(i);
          }}
          onClose={() => setListOpen(false)}
        />
      )}

      {/* Desktop pill */}
      <div className="hidden sm:flex glass rounded-full items-center gap-4 p-3 pr-5 text-white">
        <Vinyl cover={track.cover} playing={isPlaying} />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-[15px] font-semibold">{track.title}</p>
            <button
              onClick={() => setListOpen((v) => !v)}
              className="shrink-0 text-white/60 transition hover:text-white"
              aria-label="প্লেলিস্ট দেখুন"
            >
              <ListIcon />
            </button>
          </div>
          <p className="truncate text-[12.5px] text-white/70">{track.artist}</p>

          <SeekBar
            progress={progress}
            onSeek={seekTo}
            className="mt-2"
          />

          <div className="mt-1 flex justify-between text-[10.5px] tabular-nums text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Transport
          isPlaying={isPlaying}
          onPrev={prev}
          onNext={next}
          onToggle={togglePlay}
        />
      </div>

      {/* Mobile stacked card */}
      <div className="sm:hidden glass rounded-3xl p-4 text-white">
        <div className="flex items-center justify-between">
          <Vinyl cover={track.cover} playing={isPlaying} size={56} />
          <button
            onClick={() => setListOpen((v) => !v)}
            className="text-white/60 transition hover:text-white"
            aria-label="প্লেলিস্ট দেখুন"
          >
            <ListIcon />
          </button>
        </div>

        <div className="mt-3 min-w-0">
          <p className="truncate text-base font-semibold">{track.title}</p>
          <p className="truncate text-sm text-white/70">{track.artist}</p>
        </div>

        <SeekBar progress={progress} onSeek={seekTo} className="mt-4" />

        <div className="mt-1 flex justify-between text-[11px] tabular-nums text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-3 flex justify-center">
          <Transport
            isPlaying={isPlaying}
            onPrev={prev}
            onNext={next}
            onToggle={togglePlay}
            large
          />
        </div>
      </div>
    </div>
  );
}

function Vinyl({
  cover,
  playing,
  size = 48,
}: {
  cover: string;
  playing: boolean;
  size?: number;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full bg-black/60 vinyl-spin"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        animationPlayState: playing ? "running" : "paused",
      }}
    >
      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
    </div>
  );
}

function SeekBar({
  progress,
  onSeek,
  className = "",
}: {
  progress: number;
  onSeek: (clientX: number, rail: HTMLDivElement) => void;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={railRef}
      className={`seek-hit relative flex h-6 w-full cursor-pointer items-center ${className}`}
      onClick={(e) => railRef.current && onSeek(e.clientX, railRef.current)}
    >
      <div className="seek-rail w-full">
        <div className="seek-fill" style={{ width: `${progress * 100}%` }} />
        <div className="seek-knob" style={{ left: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

function Transport({
  isPlaying,
  onPrev,
  onNext,
  onToggle,
  large = false,
}: {
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  large?: boolean;
}) {
  const btn = large ? "h-11 w-11" : "h-8 w-8";
  return (
    <div className="flex shrink-0 items-center gap-2 text-white">
      <button
        onClick={onPrev}
        aria-label="আগের গান"
        className={`flex ${btn} items-center justify-center rounded-full text-white/80 transition hover:text-white`}
      >
        <PrevIcon />
      </button>
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "থামান" : "চালান"}
        className={`flex ${large ? "h-14 w-14" : "h-10 w-10"} items-center justify-center rounded-full bg-white text-black transition hover:scale-105`}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        onClick={onNext}
        aria-label="পরের গান"
        className={`flex ${btn} items-center justify-center rounded-full text-white/80 transition hover:text-white`}
      >
        <NextIcon />
      </button>
    </div>
  );
}

function PlaylistDrawer({
  activeId,
  onSelect,
  onClose,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="glass absolute bottom-full mb-3 max-h-80 w-full overflow-y-auto rounded-2xl p-3 text-white">
      <div className="mb-1 flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-white/70">প্লেলিস্ট</p>
        <button
          onClick={onClose}
          className="text-white/50 transition hover:text-white"
          aria-label="বন্ধ করুন"
        >
          ✕
        </button>
      </div>
      {playlists.map((pl) => (
        <div key={pl.id} className="mb-2">
          <p className="px-1 py-1 text-[11px] uppercase tracking-wide text-white/50">
            {pl.name}
          </p>
          {pl.tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-white/10 ${
                t.id === activeId ? "text-accent" : "text-white/85"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-[1px]">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" />
    </svg>
  );
}
