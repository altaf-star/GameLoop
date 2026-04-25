import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading.jsx';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: game, loading, error } = useApi(`/games/${id}`);
  const [renting, setRenting] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleRent = async () => {
    if (!user) return navigate('/login');
    setRenting(true);
    setMsg(null);
    try {
      await api.post('/rentals/rent', { gameId: id });
      setMsg({ type: 'success', text: 'Rental confirmed! Check your dashboard.' });
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Could not rent this game.' });
    } finally {
      setRenting(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !game) return <div className="max-w-3xl mx-auto px-6 py-16 text-center text-ps-muted">Game not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/games" className="text-sm text-ps-muted hover:text-ps-text mb-4 inline-block">← Back to games</Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-ps-surface">
          {game.image
            ? <img src={game.image} alt={game.title} className={`w-full h-full ${game.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`} />
            : <div className="w-full h-full flex items-center justify-center text-ps-muted">No image</div>}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            {game.available
              ? <span className="badge-success">Available</span>
              : <span className="badge-danger">Currently Rented</span>}
            <span className="badge-info">{game.genre}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{game.title}</h1>
          <p className="text-ps-muted leading-relaxed">{game.description}</p>

          {msg && (
            <div className={`mt-6 p-3 rounded-lg text-sm border ${
              msg.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>{msg.text}</div>
          )}

          <div className="mt-8">
            <button
              onClick={handleRent}
              disabled={!game.available || renting}
              className="btn-primary text-base px-6 py-3"
            >
              {!game.available ? 'Not Available' : renting ? 'Adding…' : 'Add to Rental List'}
            </button>
            {!user && (
              <p className="text-xs text-ps-muted mt-3">You'll be asked to sign in first.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
