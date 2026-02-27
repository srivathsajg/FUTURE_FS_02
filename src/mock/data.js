export const MOCK_STATS = {
  totalLeads: 128,
  contactedCount: 54,
  convertedCount: 22,
  leadsByStatus: [
    { status: 'new', count: 52 },
    { status: 'contacted', count: 54 },
    { status: 'converted', count: 22 },
    { status: 'lost', count: 12 },
  ],
}

export const MOCK_LEADS = [
  { _id: 'l1', name: 'Acme Corp', email: 'sales@acme.com', phone: '9876543210', status: 'new', value: 500000, source: 'Website', followUpDate: '2026-03-01' },
  { _id: 'l2', name: 'Globex', email: 'info@globex.io', phone: '9123456789', status: 'contacted', value: 820000, source: 'Referral', followUpDate: '2026-03-05' },
  { _id: 'l3', name: 'Initech', email: 'marketing@initech.co', phone: '9988776655', status: 'converted', value: 1250000, source: 'LinkedIn', followUpDate: '2026-03-08' },
  { _id: 'l4', name: 'Umbrella', email: 'biz@umbrella.com', phone: '9090909090', status: 'new', value: 300000, source: 'Event', followUpDate: '2026-03-12' },
  { _id: 'l5', name: 'Stark Industries', email: 'contact@stark.com', phone: '9911223344', status: 'contacted', value: 1500000, source: 'Website', followUpDate: '2026-03-20' },
]

export const MOCK_NOTES = {
  l1: [
    { _id: 'n1', content: 'Initial form submission received', createdAt: '2026-02-10T09:30:00Z' },
    { _id: 'n2', content: 'Sent pricing deck and case studies', createdAt: '2026-02-12T11:00:00Z' },
  ],
  l2: [{ _id: 'n3', content: 'Intro call completed, awaiting proposal feedback', createdAt: '2026-02-11T16:15:00Z' }],
  l3: [{ _id: 'n4', content: 'Deal closed. Kickoff scheduled', createdAt: '2026-02-09T14:05:00Z' }],
}
