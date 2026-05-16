import AdminLayout from '../../components/AdminLayout.jsx';
import ContactCell from '../../components/ContactCell.jsx';
import { useApi } from '../../hooks/useApi';
import Loading from '../../components/Loading.jsx';
import Reveal from '../../components/Reveal.jsx';

function fmt(d) { return new Date(d).toLocaleDateString(); }

const PLAN_LABELS = {
  starter: 'Starter',
  duo: 'Duo Bundle',
  trio: 'Trio Bundle',
  vault_master: 'Vault Master',
};

export default function AdminSubscriptions() {
  const { data, loading } = useApi('/admin/subscriptions');

  return (
    <AdminLayout title="Subscriptions">
      {loading ? <Loading /> : (
        <Reveal><div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ps-surface text-ps-muted text-left">
              <tr>
                <th className="px-4 py-3 min-w-[260px]">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Monthly</th>
                <th className="px-4 py-3">Deposit</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(s => (
                <tr key={s._id} className="border-t border-ps-border align-top">
                  <td className="px-4 py-3"><ContactCell user={s.user} /></td>
                  <td className="px-4 py-3">{PLAN_LABELS[s.plan] || s.plan}</td>
                  <td className="px-4 py-3">Rs. {s.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">{s.deposit ? `Rs. ${s.deposit.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">{fmt(s.startDate)}</td>
                  <td className="px-4 py-3">{fmt(s.endDate)}</td>
                  <td className="px-4 py-3">
                    <span className={
                      s.status === 'active' ? 'badge-success' :
                      s.status === 'pending' ? 'badge-warn' :
                      s.status === 'expired' ? 'badge-danger' : 'badge'
                    }>{s.status}</span>
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
