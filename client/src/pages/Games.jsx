import { useState, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import GameCard from '../components/GameCard.jsx';
import Loading from '../components/Loading.jsx';
import Reveal from '../components/Reveal.jsx';

export default function Games() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genre) params.set('genre', genre);
    params.set('page', page);
    params.set('limit', 12);
    return params.toString();
  }, [search, genre, page]);

  const { data, loading, error } = useApi(`/games?${query}`, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">PS5 Game Library</h1>
        <p className="text-ps-muted mt-2">Browse our full collection. Subscribe to a plan to start renting.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search games…"
          className="input flex-1"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="input md:w-56"
          value={genre}
          onChange={(e) => { setGenre(e.target.value); setPage(1); }}
        >
          <option value="">All genres</option>
          {(data?.genres || []).map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading && <Loading />}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {data && !loading && (
        <>
          {data.items.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-ps-muted">No games match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {data.items.map((g, i) => (
                <Reveal key={g._id} delay={(i % 4) * 80}>
                  <GameCard game={g} />
                </Reveal>
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                className="btn-outline"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >Previous</button>
              <span className="text-ps-muted text-sm px-4">Page {data.page} of {data.pages}</span>
              <button
                className="btn-outline"
                disabled={page >= data.pages}
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
              >Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
