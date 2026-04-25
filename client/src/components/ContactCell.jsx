import { toWhatsAppNumber, formatAddress } from '../utils/contact';

// Admin-side contact block. Shows the user's name, verification badge,
// email, phone + WhatsApp/call shortcuts, and the full delivery address.
// Re-used across Rentals, Payments, Users admin pages.
export default function ContactCell({ user, compact }) {
  if (!user) return <span className="text-ps-muted text-xs">—</span>;
  const wa = toWhatsAppNumber(user.phone);
  const addr = formatAddress(user.address);

  return (
    <div className={compact ? 'text-xs space-y-0.5' : 'text-sm space-y-1'}>
      <div className="flex items-center gap-2">
        <span className="font-medium">{user.name}</span>
        {user.isVerified
          ? <span className="badge-success text-[10px] px-1.5 py-0">✓ verified</span>
          : <span className="badge-warn text-[10px] px-1.5 py-0">unverified</span>}
      </div>

      <a href={`mailto:${user.email}`} className="block text-ps-muted hover:text-ps-blueLight truncate">
        ✉ {user.email}
      </a>

      {user.phone && (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href={`tel:${user.phone}`} className="text-ps-muted hover:text-ps-blueLight">
            📞 {user.phone}
          </a>
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
      )}

      {addr && (
        <div className="text-ps-muted">🏠 {addr}</div>
      )}
    </div>
  );
}
