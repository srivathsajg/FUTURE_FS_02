const Lead = require('../models/Lead');
const Note = require('../models/Note');

async function createLead(req, res) {
  const data = req.body || {};
  const lead = await Lead.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: data.status || 'new',
    source: data.source,
    value: data.value || 0,
    followUpDate: data.followUpDate,
  });
  res.status(201).json(lead);
}

async function getLeads(req, res) {
  const { q, status } = req.query;
  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (q) {
    const term = String(q).trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
      { source: { $regex: term, $options: 'i' } },
    ];
  }
  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.json(leads);
}

async function getLeadById(req, res) {
  const { id } = req.params;
  const lead = await Lead.findById(id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  const notes = await Note.find({ lead: lead._id }).sort({ createdAt: -1 });
  res.json({ lead, notes });
}

async function updateLead(req, res) {
  const { id } = req.params;
  const data = req.body || {};
  const updated = await Lead.findByIdAndUpdate(
    id,
    {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      source: data.source,
      value: data.value,
      followUpDate: data.followUpDate,
    },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Lead not found' });
  res.json(updated);
}

async function deleteLead(req, res) {
  const { id } = req.params;
  const found = await Lead.findByIdAndDelete(id);
  if (!found) return res.status(404).json({ message: 'Lead not found' });
  await Note.deleteMany({ lead: id });
  res.json({ ok: true });
}

module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead };
