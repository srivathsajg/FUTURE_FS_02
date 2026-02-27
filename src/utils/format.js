export function formatINR(value) {
  try {
    const num = typeof value === 'number' ? value : Number(value || 0)
    // Force the rupee symbol to avoid environment fallbacks showing '$'
    const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num)
    return `₹${formatted}`
  } catch {
    return `₹${value || 0}`
  }
}

export function formatIndianPhone(phone) {
  if (!phone) return '-'
  const digits = String(phone).replace(/\D/g, '')
  let last10 = digits.slice(-10)
  if (last10.length !== 10) return phone
  const first = last10.slice(0, 5)
  const second = last10.slice(5)
  return `+91 ${first} ${second}`
}
