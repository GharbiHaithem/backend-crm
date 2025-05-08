const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['tâche', 'visite', 'réunion'] },
  title: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  location: String,
  participants: [String],
  client: String,
  status: { type: String, default: 'planifié' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);