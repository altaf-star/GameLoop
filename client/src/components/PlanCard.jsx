// Single card in the pricing grid. `highlighted` controls the "flagship"
// visual treatment (glow + filled CTA + ribbon). When the plan opts into
// installments, we surface that as a subtle inline badge — the actual
// gating (KYC / loyalty history) is handled offline by admin.
export default function PlanCard({ planKey, plan, onSubscribe, highlighted, busy }) {
  if (!plan) return null;
  return (
    <div className={`card relative ${highlighted ? 'border-ps-blue shadow-glow' : ''}`}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ps-blue text-white text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-xl font-bold">{plan.name}</h3>
      {plan.tagline && (
        <p className="text-xs text-ps-muted mt-1">{plan.tagline}</p>
      )}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold">Rs. {plan.price?.toLocaleString()}</span>
        <span className="text-ps-muted text-sm">/ month</span>
      </div>
      {plan.deposit !== undefined && (
        <div className="mt-2 text-xs text-ps-muted">
          + Rs. {plan.deposit.toLocaleString()} refundable deposit
        </div>
      )}
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> {plan.gameLimit} {plan.gameLimit === 1 ? 'game' : 'games'} at a time</li>
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> {plan.durationDays}-day cycle</li>
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> Free delivery & pickup</li>
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> Full PS5 catalog access</li>
        {plan.installmentEligible && (
          <li className="flex gap-2 text-ps-blueLight">
            <span>★</span> Deposit installments available <span className="text-ps-muted">(KYC / loyalty)</span>
          </li>
        )}
      </ul>
      <button
        onClick={() => onSubscribe?.(planKey)}
        disabled={busy}
        className={`mt-6 w-full ${highlighted ? 'btn-primary' : 'btn-outline'}`}
      >
        {busy ? 'Processing…' : 'Subscribe'}
      </button>
    </div>
  );
}
