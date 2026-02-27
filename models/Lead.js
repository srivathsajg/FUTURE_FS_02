const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'lost'],
      default: 'new',
      index: true,
    },
    source: { type: String, trim: true },
    value: { type: Number, default: 0 },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', LeadSchema);
module.exports = Lead;

