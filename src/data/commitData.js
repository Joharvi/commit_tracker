/* Placeholder data — no real customer names, people or IDs */

export const PLACEHOLDER_ACCOUNTS = [
  { id: 'a1', name: 'Account Corp (Primary)', billForShortfall: false, globalCompany: 'none', accountNameLocal: 'none', countryCode: 'none', uduns: 'none' },
  { id: 'a2', name: 'Account Corp Inc.', billForShortfall: false, globalCompany: 'none', accountNameLocal: 'none', countryCode: 'none', uduns: 'none' },
  { id: 'a3', name: 'Account Corp Australia – GAA', billForShortfall: false, globalCompany: 'Account Corp Australia', accountNameLocal: 'none', countryCode: 'AU', uduns: '985015354' },
  { id: 'a4', name: 'Account Holdings', billForShortfall: false, globalCompany: 'Account Corp Australia', accountNameLocal: 'none', countryCode: 'AU', uduns: '985015354' },
  { id: 'a5', name: 'Account Holdings – GAA 1', billForShortfall: false, globalCompany: 'Account Corp Australia', accountNameLocal: 'none', countryCode: 'AU', uduns: '985015354' },
  { id: 'a6', name: 'Account Holdings – GAA 2', billForShortfall: false, globalCompany: 'none', accountNameLocal: 'none', countryCode: 'none', uduns: '985015354' },
  { id: 'a7', name: 'Account Holdings – GAA 3', billForShortfall: false, globalCompany: 'none', accountNameLocal: 'none', countryCode: 'none', uduns: '985015354' },
]

export const ACTIVE_WORKSPACE_STATE = {
  customerName: 'Account Corp',
  commitType: 'New',
  totalCommitValue: 5000000,
  termMonths: 36,
  startDate: '2026-10-09',
  affiliateAccount: false,
  selectedAccountIds: ['a1', 'a2', 'a3'],
  billForShortfallId: 'a2',
}

export const POPULATED_COMMIT = {
  id: 'SFC-20261009-134409-0001',
  commitNumber: 'CMT-00001',
  commitName: 'Account Corp Inc. – SFC-20261009-134409-0001',
  account: 'Account Corp Inc.',
  commitType: 'New',
  status: 'Draft',
  requiresApproval: false,
  currency: 'USD – U.S. Dollar',
  owner: 'Rep One',
  totalCommitValue: 150000000,
  discountVariancePct: null,
  termMonths: 36,
  startDate: '2026-08-06',
  endDate: '2029-08-05',
  createdBy: 'Rep One',
  createdAt: '10/5/2026, 1:44 PM',
  modifiedBy: 'Rep One',
  modifiedAt: '10/5/2026, 1:44 PM',
  commitConsumed: 8970000,
  rolloverTotal: 0,
  participatingAccountIds: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'],
  billForShortfallId: 'a2',
}

export function calcEndDate(startDateStr, termMonths) {
  if (!startDateStr || !termMonths) return null
  const d = new Date(startDateStr)
  d.setMonth(d.getMonth() + Number(termMonths))
  d.setDate(d.getDate() - 1)
  return d
}

export function formatDate(d) {
  if (!d) return '—'
  const dt = typeof d === 'string' ? new Date(d) : d
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatCurrency(n, compact = false) {
  if (n == null || n === '') return '—'
  if (compact) {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  }
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

export function buildDrawdownRows(startDateStr, termMonths, consumed) {
  const rows = []
  const years = Math.ceil(termMonths / 12)
  const annualCommit = 150000000 // based on populated commit
  const start = new Date(startDateStr)
  for (let y = 0; y < years; y++) {
    const rowStart = new Date(start)
    rowStart.setFullYear(rowStart.getFullYear() + y)
    const rowEnd = new Date(rowStart)
    rowEnd.setFullYear(rowEnd.getFullYear() + 1)
    rowEnd.setDate(rowEnd.getDate() - 1)
    const drawdown = y === 0 ? consumed : 0
    const remaining = annualCommit - drawdown
    const pctUsed = ((drawdown / annualCommit) * 100).toFixed(2) + '%'
    rows.push({
      year: y + 1,
      startDate: formatDate(rowStart),
      endDate: formatDate(rowEnd),
      annualCommit,
      drawdown,
      remaining,
      pctUsed,
      orders: y === 0 ? 6 : 0,
    })
  }
  return rows
}

export const CONTRACTS = [
  { number: 'CON-00136', account: 'Account Corp (Primary)', status: 'Draft', startDate: 'Aug 6, 2026', endDate: 'Aug 5, 2027', term: 12, totalValue: 345000 },
  { number: 'CON-00135', account: 'Account Corp Inc.', status: 'Draft', startDate: 'Aug 6, 2026', endDate: 'Aug 5, 2027', term: 12, totalValue: 115000 },
  { number: 'CON-00138', account: 'Account Holdings', status: 'Draft', startDate: 'Aug 6, 2026', endDate: 'Aug 5, 2027', term: 12, totalValue: 760000 },
  { number: 'CON-00137', account: 'Account Holdings – GAA 1', status: 'Draft', startDate: 'Aug 6, 2026', endDate: 'Aug 5, 2027', term: 12, totalValue: 800000 },
  { number: 'CON-00128', account: 'Account Holdings – GAA 2', status: 'Draft', startDate: 'Aug 6, 2026', endDate: 'Aug 5, 2027', term: 12, totalValue: 1950000 },
  { number: 'CON-00127', account: 'Account Holdings – GAA 3', status: 'Draft', startDate: 'Aug 6, 2026', endDate: '—', term: null, totalValue: 5000000 },
]

export const ORDERS = [
  { number: 'ORD-00135', account: 'Account Corp Inc.', status: 'Draft', orderDate: 'Aug 6, 2026', totalAmount: 115000, type: 'New' },
  { number: 'ORD-00138', account: 'Account Holdings', status: 'Draft', orderDate: 'Aug 6, 2026', totalAmount: 760000, type: 'New' },
]

export const COMMIT_HISTORY = [
  {
    commitId: 'SFC-20261015-161233-0002',
    customer: 'Account Corp Inc.',
    createdBy: 'Rep Two',
    type: 'Renewal',
    status: 'Draft',
    totalValue: 150000,
    termMo: 36,
    variancePct: '',
    createdDate: 'Oct 15, 2026',
  }
]
