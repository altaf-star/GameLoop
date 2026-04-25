import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkCls = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition ${
      isActive ? 'text-ps-blueLight' : 'text-ps-muted hover:text-ps-text'
    }`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ps-bg/80 border-b border-ps-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-9 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkCls} end>Home</NavLink>
          <NavLink to="/games" className={linkCls}>Games</NavLink>
          <NavLink to="/plans" className={linkCls}>Plans</NavLink>
          <NavLink to="/faq" className={linkCls}>FAQ</NavLink>
          <NavLink to="/contact" className={linkCls}>Contact</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-outline">Admin</Link>
              )}
              <Link to="/dashboard" className="btn-ghost">Hi, {user.name.split(' ')[0]}</Link>
              <button onClick={handleLogout} className="btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-ps-text">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ps-border px-4 py-3 space-y-1">
          <NavLink to="/" onClick={() => setOpen(false)} className={linkCls} end>Home</NavLink>
          <NavLink to="/games" onClick={() => setOpen(false)} className="block px-3 py-2 text-ps-muted">Games</NavLink>
          <NavLink to="/plans" onClick={() => setOpen(false)} className="block px-3 py-2 text-ps-muted">Plans</NavLink>
          <NavLink to="/faq" onClick={() => setOpen(false)} className="block px-3 py-2 text-ps-muted">FAQ</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className="block px-3 py-2 text-ps-muted">Contact</NavLink>
          <div className="pt-2 border-t border-ps-border flex gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-outline flex-1">Dashboard</Link>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="btn-outline flex-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
