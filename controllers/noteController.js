const Note = require('../models/Note');
const Lead = require('../models/Lead');

async function addNote(req, res) {
  const { leadId } = req.params;
  const { content } = req.body || {};
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Note content is required' });
  }
  const lead = await Lead.findById(leadId);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  const note = await Note.create({
    lead: lead._id,
    content: content.trim(),
    createdBy: (req.user && req.user.name) || 'Admin',
  });
  res.status(201).json(note);
}

module.exports = { addNote };

