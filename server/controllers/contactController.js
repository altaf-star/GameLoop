const { sendEmail, templates } = require('../utils/email');

// Basic in-memory rate limit so the public form can't be weaponised as an
// open relay. Keyed by IP; 3 submissions per 10 minutes.
const HITS = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 3;

function limited(ip) {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (arr.length >= MAX_HITS) return true;
  arr.push(now);
  HITS.set(ip, arr);
  return false;
}

exports.send = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ message: 'Message is too long (max 2000 chars)' });
    }
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (limited(ip)) {
      return res.status(429).json({ message: 'Too many messages — please try again later' });
    }

    // Support inbox is intentionally separate from ADMIN_EMAIL: the latter is
    // the admin's login identity, while this is the public contact destination.
    // Falls back to ADMIN_EMAIL for older deploys that haven't set SUPPORT_EMAIL.
    const supportInbox = process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL;
    if (!supportInbox) return res.status(500).json({ message: 'Support inbox not configured' });

    const result = await sendEmail({
      to: supportInbox,
      replyTo: email,
      ...templates.contactMessage(name, email, message),
    });

    if (result?.error) {
      return res.status(502).json({ message: 'Could not send the message right now' });
    }

    res.json({ message: 'Message sent' });
  } catch (err) { next(err); }
};
