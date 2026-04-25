import AdminLayout from '../../components/AdminLayout.jsx';
import { useApi } from '../../hooks/useApi';
import Loading from '../../components/Loading.jsx';
import Reveal from '../../components/Reveal.jsx';

function StatCard({ label, value, accent }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wider text-ps-muted">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${accent || ''}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, loading } = useApi('/admin/stats');

  return (
    <AdminLayout title="Admin Dashboard">
      {loading ? <Loading /> : data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Reveal delay={0}>   <StatCard label="Total Users" value={data.totalUsers} /></Reveal>
          <Reveal delay={100}> <StatCard label="Games in Catalog" value={data.totalGames} /></Reveal>
          <Reveal delay={200}> <StatCard label="Active Rentals" value={data.activeRentals} accent="text-ps-blueLight" /></Reveal>
          <Reveal delay={300}> <StatCard label="Revenue" value={`Rs. ${data.revenue.toLocaleString()}`} accent="text-green-400" /></Reveal>
        </div>
      )}
      <Reveal delay={400}>
        <div className="mt-10 card">
          <h3 className="font-semibold mb-2">Quick actions</h3>
          <p className="text-sm text-ps-muted">Use the tabs above to manage games, review payment uploads, approve subscriptions, and track rentals.</p>
        </div>
      </Reveal>
    </AdminLayout>
  );
}
