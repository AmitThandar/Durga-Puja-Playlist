# আগমনী — Sharodiya Nostalgia Player

Single-page nostalgia music site. Next.js App Router + TypeScript + Tailwind v4
(`@theme` tokens in `app/globals.css`, no `tailwind.config`).

## Run it

```bash
npm install
npm run dev
```

## Assets you need to drop in

**Background** (you said you'd provide these):

- `public/bg/scene-wide.png` — landscape hero, used by default
- `public/bg/scene-tall.png` — portrait hero, swapped in via
  `@media (orientation: portrait)` in `app/globals.css`. Compose it
  separately — it is not a crop of the wide version.

**Song audio + cover art** — the three playlists in `lib/songs.ts` were built
from the song lists you pasted (সোনালী সন্ধ্যা, শ্রাবণের গান, দুর্গা আলো).
There's no audio attached to those titles yet, so each track currently
points at a placeholder path:

- `public/audio/<playlist-id>/track-01.mp3`, `track-02.mp3`, …
- `public/covers/<playlist-id>.jpg` (one shared cover per playlist — swap
  to per-track covers by editing the `cover` field in `lib/songs.ts`)

Drop matching files into those folders (playlist ids: `sonali-sondhya`,
`srabon`, `dugga-alo`) and playback will work immediately — no code changes
needed unless you want per-track covers or different file names.

Also edit the `artist` field in `lib/songs.ts` — it's currently a
placeholder (`শিল্পী অজানা` / "artist unknown") since none were given.

## Structure

- `app/page.tsx` — server component: fixed background, grain overlay, top
  row (clock / listener count / social), bottom-anchored player.
- `app/components/TopBar.tsx` — client component for the three fixed
  top-row items (clock needs an interval; listener count is a simulated
  live figure — wire it to a real source when you have one).
- `app/components/Player.tsx` — client component with two independent
  layouts (`hidden sm:flex` desktop pill / `sm:hidden` mobile card), a
  spinning vinyl tied to playback state, a custom seek bar, transport
  controls, and a glass playlist drawer for browsing all three sets.
- `app/globals.css` — Tailwind v4 theme tokens, hero background + portrait
  swap, SVG-turbulence grain, the glass recipe, seek bar styling.

All four fixed corners and the player's bottom padding use
`max(1rem, env(safe-area-inset-*))`; `viewportFit: "cover"` is set in
`app/layout.tsx`.
