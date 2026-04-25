export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
      <p className="text-ps-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="card prose prose-invert max-w-none text-sm leading-relaxed space-y-5">
        <section>
          <h3 className="font-semibold text-base">1. Service</h3>
          <p className="text-ps-muted mt-1">GameLoop operates a subscription-based physical game rental service. By subscribing you agree to these terms.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base">2. Subscription</h3>
          <p className="text-ps-muted mt-1">Plans run for 30 days from the approval date. Game limits are enforced per plan. Subscriptions do not auto-renew.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base">3. Care of Rented Items</h3>
          <p className="text-ps-muted mt-1">Members are responsible for the safe handling of rented CDs. Lost, stolen, or damaged discs beyond normal wear will be charged at the current retail price.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base">4. Late Returns</h3>
          <p className="text-ps-muted mt-1">Rentals are due within 14 days. Late returns may incur a fee and temporary pause of your subscription.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base">5. Payment</h3>
          <p className="text-ps-muted mt-1">Payments are processed manually via NayaPay, EasyPaisa, or bank transfer. Subscriptions activate only after admin verification.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base">6. Termination</h3>
          <p className="text-ps-muted mt-1">We reserve the right to terminate accounts that abuse the service, repeatedly return damaged items, or fail to pay.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base">7. Liability</h3>
          <p className="text-ps-muted mt-1">GameLoop is not liable for indirect damages arising from use of the service. Our maximum liability is capped at the subscription amount paid.</p>
        </section>
      </div>
    </div>
  );
}
