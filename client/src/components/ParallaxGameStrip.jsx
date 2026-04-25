import { useApi } from '../hooks/useApi';

// A horizontal row of game cover art that slowly scrolls right-to-left
// forever. Placed absolutely inside the hero — purely decorative, so it's
// dim and pointer-events-none.
//
// Trick for seamless looping: we render the cover list twice back-to-back
// and animate translateX from 0 to -50%. When the first copy is out of
// frame, the second copy is exactly where the first started — invisible jump.
export default function ParallaxGameStrip() {
  const { data } = useApi('/games?limit=10');
  const games = data?.items || [];
  if (games.length === 0) return null;

  const loop = [...games, ...games];

  return (
    <div className="absolute inset-x-0 bottom-0 h-72 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex gap-5 animate-marquee w-max opacity-25">
        {loop.map((g, i) => (
          <div
            key={`${g._id}-${i}`}
            className="flex-shrink-0 w-40 h-60 rounded-xl overflow-hidden border border-ps-border shadow-glow"
          >
            {g.image && (
              <img
                src={g.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
