import { Link } from 'react-router-dom';

export default function GameCard({ game }) {
  return (
    <Link
      to={`/games/${game._id}`}
      className="group card p-0 overflow-hidden hover:border-ps-blue hover:shadow-glow hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative aspect-[3/4] bg-ps-surface overflow-hidden">
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className={`w-full h-full ${game.imageFit === 'contain' ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x500/1a2235/8a97b0?text=No+Image'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ps-muted text-sm">No image</div>
        )}
        <div className="absolute top-2 right-2">
          {game.available
            ? <span className="badge-success">Available</span>
            : <span className="badge-danger">Rented</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{game.title}</h3>
        <p className="text-xs text-ps-muted mt-1">{game.genre}</p>
      </div>
    </Link>
  );
}
