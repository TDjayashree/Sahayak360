const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, default: 'citizen' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['status_update', 'assignment', 'resolution', 'alert', 'feedback'], 
    default: 'status_update' 
  },
  complaintId: { type: String },
  trackingId: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
