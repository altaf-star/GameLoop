import { useState } from 'react';

const FAQS = [
  { q: 'How does the rental process work?', a: 'Subscribe to a plan, pick games from our catalog, and we deliver the physical CDs to your door. Keep each game for up to 14 days, then return it to free up a rental slot.' },
  { q: 'How many games can I rent at once?', a: 'Depends on your plan. Basic allows 2, Standard allows 4, and Premium allows 6 active rentals at any time.' },
  { q: 'Which cities do you deliver to?', a: 'Currently Karachi, Lahore, and Islamabad. We\'re expanding across Pakistan.' },
  { q: 'How long does delivery take?', a: 'Within Lahore: same day. Other cities: 1–3 business days.' },
  { q: 'What if a game is scratched or damaged?', a: 'Notify us immediately on WhatsApp. If the damage is from our side, we\'ll replace it free. Accidental damage by the renter may incur a fee.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes. Your plan stays active until the current 30-day cycle ends; we don\'t charge automatically for the next one.' },
  { q: 'Do you sell games too?', a: 'No — we\'re rental-only. But we regularly add new PS5 releases to the catalog.' },
  { q: 'How do I pay?', a: 'NayaPay, EasyPaisa, or bank transfer. After subscribing, you\'ll see the payment details and upload a screenshot — we verify manually.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-ps-muted mb-10">Can't find your answer? <a href="/contact" className="text-ps-blueLight hover:underline">Contact us</a>.</p>

      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="card p-0">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full text-left px-5 py-4 flex justify-between items-center"
            >
              <span className="font-semibold">{f.q}</span>
              <span className={`transition-transform ${open === i ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-ps-muted text-sm leading-relaxed border-t border-ps-border pt-4">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
