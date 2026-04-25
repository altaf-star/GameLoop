import AdminLayout from '../../components/AdminLayout.jsx';
import ContactCell from '../../components/ContactCell.jsx';
import { useApi } from '../../hooks/useApi';
import Loading from '../../components/Loading.jsx';
import Reveal from '../../components/Reveal.jsx';
import api from '../../services/api';
import { useState } from 'react';

function fmt(d) { return new Date(d).toLocaleDateString(); }

const DELIVERY_OPTIONS = [
  { value: 'processing', label: 'Processing' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
];

export default function AdminRentals() {
  const { data, loading, refetch } = useApi('/admin/rentals');
  const [busy, setBusy] = useState(null);

  const markReturned = async (rentalId) => {
    setBusy(rentalId);
    try { await api.post('/rentals/return', { rentalId }); await refetch(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setBusy(null); }
  };

  const updateDelivery = async (rentalId, deliveryStatus) => {
    setBusy(rentalId);
    try {
      await api.put(`/rentals/${rentalId}/delivery`, { deliveryStatus });
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminLayout title="Rentals">
      {loading ? <Loading /> : (
        <Reveal><div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ps-surface text-ps-muted text-left">
              <tr>
                <th className="px-4 py-3 min-w-[260px]">Customer</th>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Rented</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(r => (
                <tr key={r._id} className="border-t border-ps-border align-top">
                  <td className="px-4 py-3"><ContactCell user={r.user} /></td>
                  <td className="px-4 py-3 font-medium">{r.game?.title}</td>
                  <td className="px-4 py-3 text-ps-muted">{fmt(r.rentedAt)}</td>
                  <td className="px-4 py-3">
                    {fmt(r.returnDeadline)}
                    {r.isLate && <div className="mt-1"><span className="badge-danger text-[10px]">LATE</span></div>}
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'active' ? (
                      <select
                        value={r.deliveryStatus || 'processing'}
                        onChange={(e) => updateDelivery(r._id, e.target.value)}
                        disabled={busy === r._id}
                        className="input text-xs py-1 px-2 w-32"
                      >
                        {DELIVERY_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-ps-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={
                      r.status === 'active' ? (r.isLate ? 'badge-danger' : 'badge-info') :
                      r.status === 'returned' ? 'badge-success' : 'badge-warn'
                    }>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'active' && (
                      <button
                        onClick={() => markReturned(r._id)}
                        disabled={busy === r._id}
                        className="text-ps-blueLight text-xs hover:underline whitespace-nowrap"
                      >
                        {busy === r._id ? 'Processing…' : 'Mark Returned'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></Reveal>
      )}
    </AdminLayout>
  );
}
