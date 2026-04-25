import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ps-border bg-ps-surface/50">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="mb-3">
            <Logo className="h-9 w-auto" />
          </div>
          <p className="text-ps-muted text-sm max-w-sm">
            Pakistan's dedicated PlayStation 5 game rental service. Subscribe, pick your games, and we'll deliver the CDs to your door.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-ps-muted">
            <li><Link to="/" className="hover:text-ps-text">Home</Link></li>
            <li><Link to="/games" className="hover:text-ps-text">Games</Link></li>
            <li><Link to="/plans" className="hover:text-ps-text">Plans</Link></li>
            <li><Link to="/contact" className="hover:text-ps-text">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-ps-muted">
            <li><Link to="/terms" className="hover:text-ps-text">Terms</Link></li>
            <li><Link to="/return-policy" className="hover:text-ps-text">Return Policy</Link></li>
            <li><Link to="/faq" className="hover:text-ps-text">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ps-border text-center text-xs text-ps-muted py-4">
        © {new Date().getFullYear()} GameLoop. Not affiliated with Sony Interactive Entertainment.
      </div>
    </footer>
  );
}
