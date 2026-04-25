export default function PlanCard({ planKey, plan, onSubscribe, highlighted, busy }) {
  return (
    <div className={`card relative ${highlighted ? 'border-ps-blue shadow-glow' : ''}`}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ps-blue text-white text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-xl font-bold">{plan.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold">Rs. {plan.price}</span>
        <span className="text-ps-muted text-sm">/ month</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> {plan.gameLimit} games per month</li>
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> {plan.durationDays}-day subscription</li>
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> Free delivery & pickup</li>
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> Full PS5 catalog access</li>
        <li className="flex gap-2"><span className="text-ps-blueLight">✓</span> Email support</li>
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
