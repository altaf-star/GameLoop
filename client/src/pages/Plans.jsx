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
        <div className="grid md:grid-cols-3 gap-6">
          <Reveal delay={0}><PlanCard planKey="basic" plan={plans.basic} onSubscribe={subscribe} busy={busy === 'basic'} /></Reveal>
          <Reveal delay={120}><PlanCard planKey="standard" plan={plans.standard} onSubscribe={subscribe} busy={busy === 'standard'} highlighted /></Reveal>
          <Reveal delay={240}><PlanCard planKey="premium" plan={plans.premium} onSubscribe={subscribe} busy={busy === 'premium'} /></Reveal>
        </div>
      )}

      <Reveal>
        <div className="mt-12 card max-w-3xl mx-auto">
          <h3 className="font-semibold mb-2">How payment works</h3>
          <ol className="text-sm text-ps-muted space-y-2 list-decimal list-inside">
            <li>Pick a plan — we create a pending subscription.</li>
            <li>Send the payment via NayaPay or EasyPaisa to the number shown on the next page.</li>
            <li>Upload a screenshot of the transaction.</li>
            <li>Once an admin verifies the payment, your subscription goes live and you can start renting.</li>
          </ol>
        </div>
      </Reveal>
    </div>
  );
}
