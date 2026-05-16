// Single source of truth for subscription plans. Keeping this server-side
// prevents a client from spoofing a cheaper plan in a request.
//
// Pricing model uses tier-decoy psychology: Starter and Duo deposits are
// close (12k vs 14k) to push price-sensitive customers up to the 2-game
// flagship. Trio/Vault Master deposits jump significantly to reflect the
// real asset risk of letting 3-4 premium PS5 games out the door.
//
// Installments on the larger deposits are NOT a free upgrade — they're
// gated behind either 3 months of perfect payment history (loyalty path)
// or a postdated cheque / verified guarantor (corporate path). The UI
// surfaces eligibility but the actual approval is an admin-side workflow.
const PLANS = {
  starter: {
    name: 'Starter',
    price: 3000,
    deposit: 12000,
    gameLimit: 1,
    durationDays: 30,
    installmentEligible: false,
    flagship: false,
    tagline: 'One game at a time — perfect for solo play.',
  },
  duo: {
    name: 'Duo Bundle',
    price: 6000,
    deposit: 14000,
    gameLimit: 2,
    durationDays: 30,
    installmentEligible: false,
    flagship: true,
    tagline: 'Two games for just Rs. 2,000 more deposit. Most popular.',
  },
  trio: {
    name: 'Trio Bundle',
    price: 9000,
    deposit: 20000,
    gameLimit: 3,
    durationDays: 30,
    installmentEligible: true,
    flagship: false,
    tagline: 'Three games for serious gamers. Installments available.',
  },
  vault_master: {
    name: 'Vault Master',
    price: 12000,
    deposit: 25000,
    gameLimit: 4,
    durationDays: 30,
    installmentEligible: true,
    flagship: false,
    tagline: 'Our top tier. Four games, full library access.',
  },
};

module.exports = { PLANS };
