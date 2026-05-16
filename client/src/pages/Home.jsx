import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import GameCard from '../components/GameCard.jsx';
import PlanCard from '../components/PlanCard.jsx';
import HeroBackground from '../components/HeroBackground.jsx';
import ParallaxGameStrip from '../components/ParallaxGameStrip.jsx';
import Reveal from '../components/Reveal.jsx';

const TESTIMONIALS = [
  { name: 'Ahmed K.', role: 'Karachi', text: 'Insane collection. I rented Spider-Man 2 and it arrived next day. Smooth experience end to end.' },
  { name: 'Hira S.', role: 'Lahore', text: 'Way cheaper than buying every game. The Duo Bundle covers all my weekend gaming.' },
  { name: 'Bilal R.', role: 'Islamabad', text: 'Customer service is quick, and returning games is just a WhatsApp away. Highly recommend.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Subscribe', desc: 'Pick a plan that matches your gaming appetite — Starter, Duo, Trio, or Vault Master.' },
  { step: '02', title: 'Choose Games', desc: 'Browse our PS5 library and queue up the titles you want to play.' },
  { step: '03', title: 'Get Delivery', desc: 'We ship the CDs to your door. Play, finish, return — repeat.' },
];

export default function Home() {
  const { data: games } = useApi('/games?limit=6');
  const { data: plans } = useApi('/subscriptions/plans');

  return (
    <div>
      {/* Hero — animated background + parallax covers drifting behind content */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <HeroBackground />
        <ParallaxGameStrip />

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
          <Reveal>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ps-blue/15 border border-ps-blue/30 text-ps-blueLight text-xs font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-ps-blueLight animate-pulse" />
                Now delivering PS5 games across Pakistan
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Rent every <span className="text-ps-blueLight">PlayStation 5</span> game you've ever wanted.
              </h1>
              <p className="mt-5 text-lg text-ps-muted max-w-2xl">
                One subscription. Unlimited play time. Physical CDs delivered straight to your door. No shelves, no commitment — just gaming.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/plans" className="btn-primary text-base px-6 py-3">Start Subscription</Link>
                <Link to="/games" className="btn-outline text-base px-6 py-3">Browse Games</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Games */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Games</h2>
              <p className="text-ps-muted mt-1">Hand-picked titles your community is playing right now.</p>
            </div>
            <Link to="/games" className="btn-ghost hidden sm:inline-flex">View all →</Link>
          </div>
        </Reveal>
        {games?.items?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.items.slice(0, 6).map((g, i) => (
              <Reveal key={g._id} delay={i * 60}>
                <GameCard game={g} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-ps-muted text-sm">Games will appear here once added by admin.</p>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((s, i) => (
            <Reveal key={s.step} delay={i * 120}>
              <div className="card hover:border-ps-blue transition h-full">
                <div className="text-ps-blueLight text-sm font-bold tracking-widest">{s.step}</div>
                <h3 className="text-xl font-bold mt-2">{s.title}</h3>
                <p className="text-ps-muted mt-2 text-sm">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Plans preview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Choose Your Plan</h2>
            <p className="text-ps-muted mt-2">Cancel anytime. 30-day cycles. Transparent pricing.</p>
          </div>
        </Reveal>
        {plans && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Reveal delay={0}><PlanCard planKey="starter" plan={plans.starter} onSubscribe={() => {}} /></Reveal>
            <Reveal delay={120}><PlanCard planKey="duo" plan={plans.duo} onSubscribe={() => {}} highlighted /></Reveal>
            <Reveal delay={240}><PlanCard planKey="trio" plan={plans.trio} onSubscribe={() => {}} /></Reveal>
            <Reveal delay={360}><PlanCard planKey="vault_master" plan={plans.vault_master} onSubscribe={() => {}} /></Reveal>
          </div>
        )}
        <Reveal>
          <div className="text-center mt-8">
            <Link to="/plans" className="btn-primary">Subscribe Now</Link>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold text-center mb-12">What Gamers Say</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div className="card h-full">
                <p className="text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-ps-border">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-ps-muted">{t.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
