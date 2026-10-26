const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['citizen', 'department_officer', 'admin'], 
    default: 'citizen' 
  },
  department: { type: String, default: null },
  designation: { type: String, default: '' },
  phone: { type: String, default: '' },
  ward: { type: String, default: '' },
  address: { type: String, default: '' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
