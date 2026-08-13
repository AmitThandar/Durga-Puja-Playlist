import TopBar from "./components/TopBar";
import Player from "./components/Player";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <div className="hero-bg fixed inset-0 -z-20" />
      <div className="grain-overlay fixed inset-0 -z-10" />

      <TopBar />

      <div className="flex-1" />

      <div
        className="flex w-full justify-center px-4 pb-4"
        style={{
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <Player />
      </div>
    </main>
  );
}
