export default function ReturnPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Return Policy</h1>
      <p className="text-ps-muted mb-8">How to return rented games and what to expect.</p>

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-semibold">Return window</h3>
          <p className="text-sm text-ps-muted mt-2">Every rental has a 14-day return window from the delivery date. Return by then to keep your rental slots free.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">How to return</h3>
          <ol className="text-sm text-ps-muted mt-2 space-y-1 list-decimal list-inside">
            <li>Hit <strong>Mark as Returned</strong> in your dashboard when the courier picks up.</li>
            <li>Hand the CD over in its original case.</li>
            <li>We confirm receipt within 24 hours and free your rental slot.</li>
          </ol>
        </div>
        <div className="card">
          <h3 className="font-semibold">Late returns</h3>
          <p className="text-sm text-ps-muted mt-2">Overdue rentals trigger a warning email and a "late" badge on your dashboard. Persistent lateness may pause new rentals until resolved.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Damaged or lost discs</h3>
          <p className="text-sm text-ps-muted mt-2">Damage beyond normal wear is charged at the disc's retail value. If a CD arrives damaged, message us within 24 hours for a free replacement.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Refunds</h3>
          <p className="text-sm text-ps-muted mt-2">Subscription fees are non-refundable once a plan is active. If your payment is rejected, no charge applies.</p>
        </div>
      </div>
    </div>
  );
}
