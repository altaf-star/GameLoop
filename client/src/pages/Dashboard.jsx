import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading.jsx';
import Reveal from '../components/Reveal.jsx';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

function fmt(d) { return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }

const DELIVERY_STEPS = [
  { key: 'processing', label: 'Processing' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'delivered', label: 'Delivered' },
];

// Mirrors the server-side PLAN keys so we render proper display names
// (`vault_master` -> `Vault Master`) instead of a raw capitalized slug.
const PLAN_LABELS = {
  starter: 'Starter',
  duo: 'Duo Bundle',
  trio: 'Trio Bundle',
  vault_master: 'Vault Master',
};

// Simple horizontal progress bar so users can see where their CD is.
function DeliveryTimeline({ status }) {
  const currentIdx = DELIVERY_STEPS.findIndex(s => s.key === status);
  return (
    <div className="flex items-center gap-2 mt-3">
      {DELIVERY_STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2 flex-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            i <= currentIdx ? 'bg-ps-blue text-white' : 'bg-ps-surface text-ps-muted border border-ps-border'
          }`}>
            {i < currentIdx ? '✓' : i + 1}
          </div>
          <span className={`text-xs ${i <= currentIdx ? 'text-ps-blueLight' : 'text-ps-muted'}`}>
            {step.label}
          </span>
          {i < DELIVERY_STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 ${i < currentIdx ? 'bg-ps-blue' : 'bg-ps-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: sub, loading: loadingSub, refetch: refetchSub } = useApi('/subscriptions/current');
  const { data: rentals, loading: loadingRentals, refetch: refetchRentals } = useApi('/rentals/mine');
  const { data: payments } = useApi('/payments/mine');
  const [busy, setBusy] = useState(null);

  const handleReturn = async (rentalId) => {
    setBusy(rentalId);
    try {
      await api.post('/rentals/return', { rentalId });
      await Promise.all([refetchSub(), refetchRentals()]);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not return.');
    } finally {
      setBusy(null);
    }
  };

  if (loadingSub || loadingRentals) return <Loading />;

  const activeRentals = rentals?.filter(r => r.status === 'active') || [];
  const pastRentals = rentals?.filter(r => r.status !== 'active') || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Hi, {user?.name} 👋</h1>
        <p className="text-ps-muted mt-1">Your rental overview.</p>
      </header>

      {/* Verification nag — blocks the user from doing anything meaningful until resolved */}
      {user && !user.isVerified && (
        <div className="card border-yellow-500/40 bg-yellow-500/5 mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <h3 className="font-semibold text-yellow-400">Verify your email to continue</h3>
            <p className="text-sm text-ps-muted mt-1">
              You can't subscribe or rent until your email is verified.
            </p>
          </div>
          <Link to="/verify-email" className="btn-primary">Verify now</Link>
        </div>
      )}

      {/* Subscription status */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Reveal delay={0}>
          <div className="card">
            <p className="text-xs uppercase text-ps-muted tracking-wider">Plan</p>
            <p className="text-2xl font-bold mt-1">
              {PLAN_LABELS[sub?.subscription?.plan] || 'None'}
            </p>
            {sub?.subscription && (
              <>
                <p className="text-xs text-ps-muted mt-2">
                  Status: <span className={
                    sub.subscription.status === 'active' ? 'text-green-400' :
                    sub.subscription.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }>{sub.subscription.status}</span>
                </p>
                {sub.subscription.deposit > 0 && (
                  <p className="text-xs text-ps-muted mt-1">
                    Deposit held: <span className="text-ps-blueLight">Rs. {sub.subscription.deposit.toLocaleString()}</span>
                  </p>
                )}
              </>
            )}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="card">
            <p className="text-xs uppercase text-ps-muted tracking-wider">Rental Slots Left</p>
            <p className="text-2xl font-bold mt-1">
              {sub?.subscription ? `${sub.slotsLeft} / ${sub.subscription.gameLimit}` : '—'}
            </p>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="card">
            <p className="text-xs uppercase text-ps-muted tracking-wider">Subscription Ends</p>
            <p className="text-2xl font-bold mt-1">
              {sub?.subscription ? fmt(sub.subscription.endDate) : '—'}
            </p>
          </div>
        </Reveal>
      </div>

      {!sub?.subscription && user?.isVerified && (
        <div className="card text-center py-10 mb-10">
          <h3 className="font-semibold text-lg">You don't have a subscription yet</h3>
          <p className="text-ps-muted text-sm mt-2">Pick a plan to start renting games.</p>
          <Link to="/plans" className="btn-primary mt-4">View Plans</Link>
        </div>
      )}

      {sub?.subscription?.status === 'pending' && (
        <div className="card border-yellow-500/30 bg-yellow-500/5 mb-10">
          <h3 className="font-semibold">Subscription pending payment verification</h3>
          <p className="text-ps-muted text-sm mt-2">
            We're reviewing your payment. Once approved, you'll be able to rent games.
          </p>
          {!sub.subscription.payment && (
            <Link to={`/payment/${sub.subscription._id}`} className="btn-primary mt-4 inline-flex">
              Upload Payment Proof
            </Link>
          )}
        </div>
      )}

      {/* Active rentals */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Currently Renting</h2>
        {activeRentals.length === 0 ? (
          <div className="card text-ps-muted text-sm">No active rentals. <Link to="/games" className="text-ps-blueLight hover:underline">Browse games →</Link></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {activeRentals.map(r => (
              <div key={r._id} className={`card ${r.isLate ? 'border-red-500/40' : ''}`}>
                <div className="flex gap-4">
                  <img src={r.game?.image} alt={r.game?.title}
                       className="w-20 h-24 object-cover rounded-lg flex-shrink-0 bg-ps-surface"
                       onError={(e) => e.currentTarget.style.display = 'none'} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{r.game?.title}</h3>
                    <p className="text-xs text-ps-muted mt-1">Rented: {fmt(r.rentedAt)}</p>
                    <p className="text-xs text-ps-muted">Return by: {fmt(r.returnDeadline)}</p>
                    {r.isLate && <p className="text-xs text-red-400 font-semibold mt-1">⚠ Overdue — please return soon</p>}
                  </div>
                </div>
                <DeliveryTimeline status={r.deliveryStatus || 'processing'} />
                {r.deliveryNote && (
                  <p className="text-xs text-ps-muted mt-3 italic">Note from admin: {r.deliveryNote}</p>
                )}
                <div className="mt-4 pt-4 border-t border-ps-border">
                  <button
                    onClick={() => handleReturn(r._id)}
                    disabled={busy === r._id || r.deliveryStatus !== 'delivered'}
                    className="btn-outline text-xs px-3 py-1.5"
                    title={r.deliveryStatus !== 'delivered' ? 'Mark returned once the CD reaches you and you\'re done playing' : ''}
                  >
                    {busy === r._id ? 'Returning…' : 'Mark as Returned'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Payment history */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Payment History</h2>
        {!payments || payments.length === 0 ? (
          <div className="card text-ps-muted text-sm">No payments yet.</div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ps-surface">
                <tr className="text-left text-ps-muted">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-t border-ps-border">
                    <td className="px-4 py-3">{fmt(p.createdAt)}</td>
                    <td className="px-4 py-3 font-semibold">Rs. {p.amount}</td>
                    <td className="px-4 py-3 capitalize">{p.method}</td>
                    <td className="px-4 py-3">
                      <span className={
                        p.status === 'approved' ? 'badge-success' :
                        p.status === 'pending' ? 'badge-warn' : 'badge-danger'
                      }>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pastRentals.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Past Rentals</h2>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ps-surface">
                <tr className="text-left text-ps-muted">
                  <th className="px-4 py-3">Game</th>
                  <th className="px-4 py-3">Rented</th>
                  <th className="px-4 py-3">Returned</th>
                </tr>
              </thead>
              <tbody>
                {pastRentals.map(r => (
                  <tr key={r._id} className="border-t border-ps-border">
                    <td className="px-4 py-3">{r.game?.title}</td>
                    <td className="px-4 py-3">{fmt(r.rentedAt)}</td>
                    <td className="px-4 py-3">{r.returnedAt ? fmt(r.returnedAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
