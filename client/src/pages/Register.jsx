import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '',
    street: '', city: '', postalCode: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
        },
      });
      // After signup, go straight to email verification.
      navigate('/verify-email');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-ps-muted text-sm mb-6">
          We need your phone and address so we can deliver the games.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full name</label>
              <input type="text" required className="input" value={form.name} onChange={update('name')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={form.email} onChange={update('email')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Password</label>
              <input type="password" required minLength={6} className="input" value={form.password} onChange={update('password')} />
              <p className="text-xs text-ps-muted mt-1">Minimum 6 characters.</p>
            </div>
            <div>
              <label className="label">Phone number</label>
              <input type="tel" required placeholder="03001234567" className="input" value={form.phone} onChange={update('phone')} />
              <p className="text-xs text-ps-muted mt-1">We'll WhatsApp you about your delivery.</p>
            </div>
          </div>

          <div>
            <label className="label">Street address</label>
            <input type="text" required placeholder="House 42, Street 7, Block B" className="input" value={form.street} onChange={update('street')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input type="text" required placeholder="Lahore" className="input" value={form.city} onChange={update('city')} />
            </div>
            <div>
              <label className="label">Postal code (optional)</label>
              <input type="text" placeholder="54000" className="input" value={form.postalCode} onChange={update('postalCode')} />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-ps-muted mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-ps-blueLight hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
