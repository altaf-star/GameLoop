// Converts a Pakistani phone number (03001234567, 0300-1234567, +92 300...)
// into wa.me format (923001234567) — strips everything non-digit and
// normalizes a leading 0 to the 92 country code.
export function toWhatsAppNumber(phone = '') {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return '92' + digits.slice(1);
  return '92' + digits;
}

export function formatAddress(addr = {}) {
  return [addr.street, addr.city, addr.postalCode].filter(Boolean).join(', ');
}
