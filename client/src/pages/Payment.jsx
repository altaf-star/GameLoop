import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Placeholder payment numbers — real deployment would fetch these from a
// settings collection or env var so the admin can rotate them.
const PAYMENT_METHODS = [
  { value: 'nayapay', label: 'NayaPay', number: '0315-7870229' },
  { value: 'easypaisa', label: 'EasyPaisa', number: '0315-7870229' },
  { value: 'bank', label: 'Bank Transfer', number: 'HBL · PK98HABB00534570000150503' },
];

export default function Payment() {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState('nayapay');
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please upload a payment screenshot.'); return; }
    setError('');
    setBusy(true);

    const fd = new FormData();
    fd.append('subscriptionId', subscriptionId);
    fd.append('method', method);
    if (transactionId) fd.append('transactionId', transactionId);
    if (amount) fd.append('amount', amount);
    fd.append('screenshot', file);

    try {
      await api.post('/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const active = PAYMENT_METHODS.find(m => m.value === method);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Complete your payment</h1>
      <p className="text-ps-muted mb-8">Send the payment and upload a screenshot. Admin approval usually takes a few hours.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">1. Send payment to</h3>
          <div className="space-y-2 mb-4">
            {PAYMENT_METHODS.map(m => (
              <label key={m.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                method === m.value ? 'border-ps-blue bg-ps-blue/5' : 'border-ps-border'
              }`}>
                <input type="radio" name="method" checked={method === m.value}
                       onChange={() => setMethod(m.value)} className="accent-ps-blue" />
                <span className="font-medium">{m.label}</span>
              </label>
            ))}
          </div>
          <div className="p-4 rounded-lg bg-ps-surface border border-ps-border">
            <p className="text-xs text-ps-muted uppercase tracking-wider">{active.label} number</p>
            <p className="text-lg font-mono font-semibold mt-1">{active.number}</p>
          </div>
        </div>

        <form onSubmit={submit} className="card">
          <h3 className="font-semibold mb-4">2. Upload screenshot</h3>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="label">Transaction ID (optional)</label>
              <input className="input" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
            </div>
            <div>
              <label className="label">Amount paid (optional)</label>
              <input type="number" className="input" placeholder="Auto-filled from plan"
                     value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="label">Screenshot</label>
              <input type="file" accept="image/*" required
                     onChange={e => pickFile(e.target.files?.[0])}
                     className="input file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-ps-blue file:text-white file:text-xs" />
              {preview && <img src={preview} alt="Preview" className="mt-3 max-h-48 rounded-lg border border-ps-border" />}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-6" disabled={busy}>
            {busy ? 'Uploading…' : 'Submit for review'}
          </button>
        </form>
      </div>
    </div>
  );
}
