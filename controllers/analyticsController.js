const Lead = require('../models/Lead');

async function getStats(req, res) {
  const totalLeads = await Lead.countDocuments({});
  const contactedCount = await Lead.countDocuments({ status: 'contacted' });
  const convertedCount = await Lead.countDocuments({ status: 'converted' });

  const grouped = await Lead.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
  ]);

  const leadsByStatus = ['new', 'contacted', 'converted', 'lost'].map((s) => {
    const row = grouped.find((g) => g.status === s);
    return { status: s, count: row ? row.count : 0 };
    });

  res.json({
    totalLeads,
    contactedCount,
    convertedCount,
    leadsByStatus,
  });
}

module.exports = { getStats };

