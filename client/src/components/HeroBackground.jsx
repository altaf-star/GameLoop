import { useState } from 'react';

// Hero background with two layers:
//  1. Always-on CSS animation — two large blurred blue blobs that drift
//     around lazily, plus a soft overlay mesh. Gives the hero a live feel
//     without any assets.
//  2. Optional video overlay — if /gameplay.mp4 exists in /public, it plays
//     on top at 35% opacity. If the file is missing or fails to load, the
//     onError handler hides the <video> and the CSS glow remains.
//
// Parent section must be `relative` so the `absolute inset-0` here positions
// correctly. Content should sit above this with `relative z-10`.
export default function HeroBackground() {
  const [hideVideo, setHideVideo] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Drifting blue blobs — heavy blur turns them into soft gradients.
          Positioned off-screen partly so the animation feels larger than the viewport. */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-ps-blue/40 blur-[140px] animate-float-1" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-ps-blueLight/30 blur-[140px] animate-float-2" />
      <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-glow" />

      {/* Subtle dot-grid — adds tech/gaming vibe without being noisy */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3b9fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Optional gameplay video. Silently fails if file is missing. */}
      {!hideVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onError={() => setHideVideo(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
          src="/gameplay.mp4"
        />
      )}

      {/* Dark gradient overlay so hero text stays readable on top of it all */}
      <div className="absolute inset-0 bg-gradient-to-b from-ps-bg/70 via-ps-bg/50 to-ps-bg" />
    </div>
  );
}
