const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  updatedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  proofAttachment: { type: String }
});

const complaintSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { 
    type: String, 
    required: true,
    enum: ['roads', 'water', 'electricity', 'sanitation', 'health'] 
  },
  category: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['submitted', 'under_review', 'in_progress', 'resolved', 'rejected'], 
    default: 'submitted' 
  },
  location: {
    address: { type: String, required: true },
    ward: { type: String, required: true },
    landmark: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  citizen: {
    id: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },
  assignedTo: {
    officerId: { type: String },
    officerName: { type: String },
    assignedAt: { type: Date }
  },
  attachments: [{
    filename: { type: String },
    originalName: { type: String },
    url: { type: String },
    mimeType: { type: String },
    size: { type: Number }
  }],
  timeline: [timelineItemSchema],
  resolution: {
    resolvedAt: { type: Date },
    resolutionNote: { type: String },
    proofImage: { type: String },
    resolvedBy: { type: String }
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    submittedAt: { type: Date }
  },
  slaDeadline: { type: Date },
  isEscalated: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
