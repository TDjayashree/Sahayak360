const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  head: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  slaHours: { type: Number, default: 24 },
  color: { type: String, default: '#0284c7' },
  icon: { type: String, default: 'Building2' },
  categories: [{ type: String }],
  description: { type: String }
});

module.exports = mongoose.model('Department', departmentSchema);
