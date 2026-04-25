import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/games', label: 'Games' },
  { to: '/admin/subscriptions', label: 'Subscriptions' },
  { to: '/admin/rentals', label: 'Rentals' },
  { to: '/admin/payments', label: 'Payments' },
];

export default function AdminLayout({ title, children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="flex flex-wrap gap-2 mb-8 border-b border-ps-border pb-4">
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-ps-blue text-white' : 'text-ps-muted hover:text-ps-text hover:bg-ps-surface'
              }`
            }
          >{l.label}</NavLink>
        ))}
      </div>
      {children}
    </div>
  );
}
