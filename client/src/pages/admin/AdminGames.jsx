import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useApi } from '../../hooks/useApi';
import Loading from '../../components/Loading.jsx';
import api from '../../services/api';

const BLANK = { title: '', genre: 'Action', description: '', image: null };

export default function AdminGames() {
  const { data, loading, refetch } = useApi('/games?limit=50');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const genres = data?.genres || [];

  const openNew = () => { setEditing('new'); setForm(BLANK); };
  const openEdit = (game) => {
    setEditing(game._id);
    setForm({ title: game.title, genre: game.genre, description: game.description, image: null });
  };
  const close = () => { setEditing(null); setForm(BLANK); setError(''); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('genre', form.genre);
    fd.append('description', form.description);
    if (form.image) fd.append('image', form.image);
    try {
      if (editing === 'new') {
        await api.post('/games', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.put(`/games/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      close();
      await refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this game?')) return;
    try { await api.delete(`/games/${id}`); await refetch(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <AdminLayout title="Games">
      <div className="flex justify-end mb-4">
        <button onClick={openNew} className="btn-primary">+ Add Game</button>
      </div>

      {loading ? <Loading /> : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ps-surface text-ps-muted text-left">
              <tr>
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map(g => (
                <tr key={g._id} className="border-t border-ps-border">
                  <td className="px-4 py-3">
                    {g.image && <img src={g.image} alt="" className="w-10 h-12 object-cover rounded" />}
                  </td>
                  <td className="px-4 py-3 font-medium">{g.title}</td>
                  <td className="px-4 py-3">{g.genre}</td>
                  <td className="px-4 py-3">
                    {g.available ? <span className="badge-success">Available</span> : <span className="badge-danger">Rented</span>}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(g)} className="text-ps-blueLight text-xs hover:underline">Edit</button>
                    <button onClick={() => remove(g._id)} className="text-red-400 text-xs hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={close}>
          <form onSubmit={submit} onClick={e => e.stopPropagation()}
                className="bg-ps-card border border-ps-border rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{editing === 'new' ? 'Add Game' : 'Edit Game'}</h3>
            {error && <div className="mb-3 p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="label">Title</label>
                <input required className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="label">Genre</label>
                <select className="input" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea rows={4} required className="input" value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="label">Cover image {editing !== 'new' && '(leave empty to keep existing)'}</label>
                <input type="file" accept="image/*" className="input"
                       onChange={e => setForm({ ...form, image: e.target.files?.[0] || null })} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button type="button" onClick={close} className="btn-outline flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
