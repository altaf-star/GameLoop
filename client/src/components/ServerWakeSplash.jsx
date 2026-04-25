import { useEffect, useState } from 'react';
import api from '../services/api';

// Render's free tier spins down after 15 min idle. First request takes 30-60s.
// Show a friendly splash so the examiner doesn't think the app is broken.
export default function ServerWakeSplash() {
  const [awake, setAwake] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const slowTimer = setTimeout(() => setSlow(true), 2500);
    api.get('/health')
      .then(() => setAwake(true))
      .catch(() => setAwake(true))
      .finally(() => clearTimeout(slowTimer));
    return () => clearTimeout(slowTimer);
  }, []);

  if (awake || !slow) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ps-bg/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-14 h-14 mx-auto mb-5 border-2 border-ps-border border-t-ps-blue rounded-full animate-spin" />
        <h2 className="text-xl font-bold mb-2">Waking up the server…</h2>
        <p className="text-ps-muted text-sm">
          Our API sleeps on free tier after inactivity. First request takes up to 60 seconds — after that it's instant. Thanks for your patience!
        </p>
      </div>
    </div>
  );
}
