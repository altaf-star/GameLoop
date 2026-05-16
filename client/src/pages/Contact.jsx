import { useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/contact', form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send your message.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Get in touch</h1>
      <p className="text-ps-muted mb-10">Questions, feedback, partnership inquiries — drop us a line.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="card mb-4">
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-sm text-ps-muted">gameloop35gl@gmail.com</p>
            <p className="text-sm text-ps-muted">+92 315 7870229 (WhatsApp)</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Office</h3>
            <p className="text-sm text-ps-muted">Sabzazar, Multan, Pakistan</p>
            <p className="text-sm text-ps-muted">Mon–Sat · 10am–8pm</p>
          </div>
        </div>

        <form onSubmit={submit} className="card">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-green-500/15 mx-auto flex items-center justify-center text-green-400 text-2xl">✓</div>
              <h3 className="font-semibold mt-4">Message sent</h3>
              <p className="text-sm text-ps-muted mt-1">We'll get back to you within a business day.</p>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
              <div className="space-y-4">
                <div>
                  <label className="label">Name</label>
                  <input required className="input" value={form.name}
                         onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" required className="input" value={form.email}
                         onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea rows={5} required className="input" value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-6" disabled={busy}>
                {busy ? 'Sending…' : 'Send message'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
