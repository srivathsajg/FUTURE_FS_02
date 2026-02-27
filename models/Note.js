const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    content: { type: String, required: true, trim: true },
    createdBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;

