import AdminLayout from '../../components/AdminLayout.jsx';
import ContactCell from '../../components/ContactCell.jsx';
import { useApi } from '../../hooks/useApi';
import Loading from '../../components/Loading.jsx';
import Reveal from '../../components/Reveal.jsx';
import api from '../../services/api';
import { useState } from 'react';

function fmt(d) { return new Date(d).toLocaleDateString(); }

export default function AdminPayments() {
  const { data, loading, refetch } = useApi('/admin/payments');
  const [busy, setBusy] = useState(null);
  const [preview, setPreview] = useState(null);

  const review = async (paymentId, status) => {
    let reason = '';
    if (status === 'rejected') {
      reason = prompt('Reason for rejection?') || 'Could not verify';
    }
    setBusy(paymentId);
    try {
      await api.put(`/payments/${paymentId}`, { status, rejectionReason: reason });
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminLayout title="Payments">
      {loading ? <Loading /> : (
        <Reveal><div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ps-surface text-ps-muted text-left">
              <tr>
                <th className="px-4 py-3 min-w-[260px]">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Proof</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(p => (
                <tr key={p._id} className="border-t border-ps-border align-top">
                  <td className="px-4 py-3"><ContactCell user={p.user} /></td>
                  <td className="px-4 py-3 capitalize">{p.subscription?.plan || '—'}</td>
                  <td className="px-4 py-3 font-semibold">Rs. {p.amount}</td>
                  <td className="px-4 py-3 capitalize">{p.method}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setPreview(p.screenshot)} className="text-ps-blueLight text-xs hover:underline">
                      View
                    </button>
                    {p.transactionId && (
                      <div className="text-[10px] text-ps-muted mt-1 font-mono">TX: {p.transactionId}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ps-muted">{fmt(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={
                      p.status === 'approved' ? 'badge-success' :
                      p.status === 'pending' ? 'badge-warn' : 'badge-danger'
                    }>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => review(p._id, 'approved')} disabled={busy === p._id}
                                className="text-green-400 text-xs hover:underline">Approve</button>
                        <button onClick={() => review(p._id, 'rejected')} disabled={busy === p._id}
                                className="text-red-400 text-xs hover:underline">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></Reveal>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <img src={preview} alt="Payment proof" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </AdminLayout>
  );
}
