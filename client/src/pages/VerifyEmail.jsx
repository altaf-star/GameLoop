import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api';

export default function VerifyEmail() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-ps-muted">You need to sign in first.</p>
        <Link to="/login" className="btn-primary mt-4 inline-flex">Sign in</Link>
      </div>
    );
  }

  if (user.isVerified) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/15 text-green-400 text-3xl mx-auto flex items-center justify-center">✓</div>
        <h1 className="text-2xl font-bold mt-4">Already verified</h1>
        <p className="text-ps-muted mt-2">Your email is confirmed. You're all set.</p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Go to dashboard</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await api.post('/auth/verify-email', { code });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Verification failed' });
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setResending(true); setMsg(null);
    try {
      await api.post('/auth/resend-verification');
      setMsg({ type: 'success', text: 'New code sent. Check your email.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Could not resend' });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Verify your email</h1>
        <p className="text-ps-muted text-sm mb-6">
          We sent a 6-digit code to <strong className="text-ps-text">{user.email}</strong>. Enter it below to activate your account.
        </p>

        {msg && (
          <div className={`mb-4 p-3 rounded-lg text-sm border ${
            msg.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>{msg.text}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            placeholder="000000"
            className="input text-center text-3xl tracking-[0.5em] font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
          <button type="submit" className="btn-primary w-full" disabled={busy || code.length !== 6}>
            {busy ? 'Verifying…' : 'Verify email'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-ps-border text-center text-sm text-ps-muted">
          Didn't get the code?{' '}
          <button
            onClick={resend}
            disabled={resending}
            className="text-ps-blueLight hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend'}
          </button>
        </div>

        <p className="text-xs text-ps-muted mt-6">
          Tip: If email isn't configured in your environment, the code is printed to the backend terminal for dev convenience.
        </p>
      </div>
    </div>
  );
}
