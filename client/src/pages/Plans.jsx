import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import PlanCard from '../components/PlanCard.jsx';
import Loading from '../components/Loading.jsx';
import Reveal from '../components/Reveal.jsx';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: plans, loading } = useApi('/subscriptions/plans');
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const subscribe = async (planKey) => {
    if (!user) return navigate('/login');
    setBusy(planKey);
    setError('');
    try {
      const { data } = await api.post('/subscriptions', { plan: planKey });
      navigate(`/payment/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not subscribe.');
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Reveal>
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">Subscription Plans</h1>
          <p className="text-ps-muted mt-3 max-w-2xl mx-auto">
            Choose the plan that matches how much you play. All plans include free delivery, full catalog access, and a 30-day cycle.
          </p>
        </header>
      </Reveal>

      {error && <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm max-w-xl mx-auto">{error}</div>}

      {plans && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Reveal delay={0}><PlanCard planKey="starter" plan={plans.starter} onSubscribe={subscribe} busy={busy === 'starter'} /></Reveal>
          <Reveal delay={120}><PlanCard planKey="duo" plan={plans.duo} onSubscribe={subscribe} busy={busy === 'duo'} highlighted /></Reveal>
          <Reveal delay={240}><PlanCard planKey="trio" plan={plans.trio} onSubscribe={subscribe} busy={busy === 'trio'} /></Reveal>
          <Reveal delay={360}><PlanCard planKey="vault_master" plan={plans.vault_master} onSubscribe={subscribe} busy={busy === 'vault_master'} /></Reveal>
        </div>
      )}

      <Reveal>
        <div className="mt-12 card max-w-3xl mx-auto">
          <h3 className="font-semibold mb-2">How payment works</h3>
          <ol className="text-sm text-ps-muted space-y-2 list-decimal list-inside">
            <li>Pick a plan — we create a pending subscription.</li>
            <li>Pay the <strong>first month + refundable deposit</strong> via NayaPay or EasyPaisa to the number shown on the next page.</li>
            <li>Upload a screenshot of the transaction.</li>
            <li>Once an admin verifies the payment, your subscription goes live and you can start renting.</li>
            <li>The deposit is returned (minus any damage charges) when you cancel and return all rented games.</li>
          </ol>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-6 card max-w-3xl mx-auto border-ps-blue/40 bg-ps-blue/5">
          <h3 className="font-semibold mb-2 text-ps-blueLight">About installment deposits</h3>
          <p className="text-sm text-ps-muted">
            Trio and Vault Master deposits can be paid in installments — but only after a
            verification step. New customers either provide a postdated cheque / verified
            guarantor, or upgrade after 3 months of perfect payment history on a lower tier.
            Contact us to start an installment plan.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
