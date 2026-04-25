// Single source of truth for subscription plans. Keeping this server-side
// prevents a client from spoofing a cheaper "premium" plan in a request.
const PLANS = {
  basic: { name: 'Basic', price: 999, gameLimit: 2, durationDays: 30 },
  standard: { name: 'Standard', price: 1799, gameLimit: 4, durationDays: 30 },
  premium: { name: 'Premium', price: 2499, gameLimit: 6, durationDays: 30 },
};

module.exports = { PLANS };
