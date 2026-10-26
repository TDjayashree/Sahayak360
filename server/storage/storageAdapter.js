const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  departmentsData,
  usersData,
  sampleComplaintsData,
  sampleNotificationsData
} = require('../data/seedData');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

class StorageAdapter {
  constructor() {
    this.isMongoConnected = false;
    this.data = {
      departments: [],
      users: [],
      complaints: [],
      notifications: [],
      auditLogs: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
      }
    } catch (err) {
      console.warn('[Storage] Failed to read db.json, re-seeding default data:', err.message);
      this.seedInitialData();
    }
  }

  seedInitialData() {
    this.data = {
      departments: [...departmentsData],
      users: [...usersData],
      complaints: [...sampleComplaintsData],
      notifications: [...sampleNotificationsData],
      auditLogs: [
        {
          id: uuidv4(),
          action: 'SYSTEM_INITIALIZED',
          details: 'Sahayak 360 civic database initialized with default departments and demo users',
          timestamp: new Date().toISOString()
        }
      ]
    };
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Storage] Error writing db.json:', err.message);
    }
  }

  // --- Departments ---
  getDepartments() {
    return this.data.departments;
  }

  getDepartmentById(id) {
    return this.data.departments.find(d => d.id === id);
  }

  // --- Users ---
  getUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  getUserById(id) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const newUser = {
      id: `user-${uuidv4().slice(0, 8)}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  // --- Complaints ---
  getComplaints(filters = {}) {
    let list = [...this.data.complaints];

    if (filters.department) {
      list = list.filter(c => c.department === filters.department);
    }
    if (filters.status) {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters.priority) {
      list = list.filter(c => c.priority === filters.priority);
    }
    if (filters.citizenId) {
      list = list.filter(c => c.citizen && c.citizen.id === filters.citizenId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c => 
        (c.trackingId && c.trackingId.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.location && c.location.address && c.location.address.toLowerCase().includes(q)) ||
        (c.location && c.location.ward && c.location.ward.toLowerCase().includes(q))
      );
    }

    // Default sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  getComplaintById(idOrTrackingId) {
    return this.data.complaints.find(
      c => c.id === idOrTrackingId || c.trackingId.toLowerCase() === idOrTrackingId.toLowerCase()
    );
  }

  generateTrackingId() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `SHK-${year}-${randomNum}`;
  }

  createComplaint(complaintData) {
    const dept = this.getDepartmentById(complaintData.department) || { slaHours: 24, name: 'General Municipal' };
    const createdAt = new Date();
    const slaDeadline = new Date(createdAt.getTime() + (dept.slaHours || 24) * 60 * 60 * 1000);

    const trackingId = this.generateTrackingId();
    const newComplaint = {
      id: `cmp-${uuidv4().slice(0, 8)}`,
      trackingId,
      title: complaintData.title,
      description: complaintData.description,
      department: complaintData.department,
      category: complaintData.category || 'General Civic Grievance',
      priority: complaintData.priority || 'medium',
      status: 'submitted',
      location: {
        address: complaintData.location?.address || 'City Area',
        ward: complaintData.location?.ward || 'Ward 1',
        landmark: complaintData.location?.landmark || '',
        latitude: complaintData.location?.latitude || 12.9716,
        longitude: complaintData.location?.longitude || 77.5946
      },
      citizen: {
        id: complaintData.citizen?.id || 'guest-citizen',
        name: complaintData.citizen?.name || 'Anonymous Citizen',
        phone: complaintData.citizen?.phone || '',
        email: complaintData.citizen?.email || ''
      },
      assignedTo: null,
      attachments: complaintData.attachments || [],
      timeline: [
        {
          status: 'submitted',
          title: 'Complaint Registered',
          description: `Grievance officially filed by ${complaintData.citizen?.name || 'Citizen'} via Sahayak 360 portal.`,
          updatedBy: complaintData.citizen?.name || 'Citizen',
          timestamp: createdAt.toISOString()
        },
        {
          status: 'under_review',
          title: `Automated Routing to ${dept.name}`,
          description: `Assigned SLA of ${dept.slaHours} hours based on municipal priority criteria.`,
          updatedBy: 'Sahayak AI Router',
          timestamp: new Date(createdAt.getTime() + 1000).toISOString()
        }
      ],
      resolution: null,
      feedback: null,
      slaDeadline: slaDeadline.toISOString(),
      isEscalated: false,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString()
    };

    this.data.complaints.unshift(newComplaint);

    // Notify Department Officers & Admin
    this.addNotification({
      role: 'department_officer',
      department: newComplaint.department,
      title: `New Grievance: ${newComplaint.title.slice(0, 40)}...`,
      message: `A new ${newComplaint.priority} priority complaint (${trackingId}) was routed to your department in ${newComplaint.location.ward}.`,
      type: 'assignment',
      complaintId: newComplaint.id,
      trackingId: newComplaint.trackingId
    });

    if (newComplaint.citizen?.id && newComplaint.citizen.id !== 'guest-citizen') {
      this.addNotification({
        userId: newComplaint.citizen.id,
        role: 'citizen',
        title: `Complaint Submitted (${trackingId})`,
        message: `Your issue has been forwarded to ${dept.name}. Track live progress using tracking ID ${trackingId}.`,
        type: 'status_update',
        complaintId: newComplaint.id,
        trackingId: newComplaint.trackingId
      });
    }

    this.save();
    return newComplaint;
  }

  updateComplaint(idOrTrackingId, updates, updatedByUser = 'System Officer') {
    const complaint = this.getComplaintById(idOrTrackingId);
    if (!complaint) return null;

    const previousStatus = complaint.status;
    const now = new Date().toISOString();

    // Check status transition
    if (updates.status && updates.status !== previousStatus) {
      complaint.status = updates.status;
      complaint.timeline.push({
        status: updates.status,
        title: updates.statusTitle || `Status updated to ${updates.status.replace('_', ' ').toUpperCase()}`,
        description: updates.statusNote || updates.note || `Status modified by ${updatedByUser}.`,
        updatedBy: updatedByUser,
        timestamp: now,
        proofAttachment: updates.proofAttachment || null
      });

      // Notification to Citizen
      if (complaint.citizen?.id) {
        this.addNotification({
          userId: complaint.citizen.id,
          role: 'citizen',
          title: `Status Update: ${complaint.trackingId}`,
          message: `Your complaint is now "${complaint.status.replace('_', ' ').toUpperCase()}". Note: ${updates.note || updates.statusNote || 'Progress recorded.'}`,
          type: updates.status === 'resolved' ? 'resolution' : 'status_update',
          complaintId: complaint.id,
          trackingId: complaint.trackingId
        });
      }
    }

    // Assigning to officer
    if (updates.assignedTo) {
      complaint.assignedTo = updates.assignedTo;
      complaint.timeline.push({
        status: complaint.status,
        title: 'Work Assigned to Field Engineer',
        description: `Task assigned to ${updates.assignedTo.officerName || 'department field staff'}.`,
        updatedBy: updatedByUser,
        timestamp: now
      });
    }

    // Department re-routing
    if (updates.department && updates.department !== complaint.department) {
      const oldDept = complaint.department;
      complaint.department = updates.department;
      complaint.timeline.push({
        status: complaint.status,
        title: 'Department Re-Routed',
        description: `Transferred from ${oldDept} to ${updates.department} by ${updatedByUser}.`,
        updatedBy: updatedByUser,
        timestamp: now
      });
    }

    // Resolution details
    if (updates.resolution) {
      complaint.resolution = {
        resolvedAt: now,
        resolutionNote: updates.resolution.resolutionNote || 'Work successfully completed.',
        proofImage: updates.resolution.proofImage || null,
        resolvedBy: updatedByUser
      };
      complaint.status = 'resolved';
    }

    // Citizen Feedback / Rating
    if (updates.feedback) {
      complaint.feedback = {
        rating: updates.feedback.rating,
        comment: updates.feedback.comment || '',
        submittedAt: now
      };
      complaint.timeline.push({
        status: 'feedback_received',
        title: 'Citizen Feedback Received',
        description: `Citizen rated this resolution ${updates.feedback.rating}/5 stars. "${updates.feedback.comment || ''}"`,
        updatedBy: complaint.citizen?.name || 'Citizen',
        timestamp: now
      });
    }

    // Urgency / Priority update
    if (updates.priority) {
      complaint.priority = updates.priority;
    }

    // Escalation flag
    if (typeof updates.isEscalated === 'boolean') {
      complaint.isEscalated = updates.isEscalated;
    }

    complaint.updatedAt = now;
    this.save();
    return complaint;
  }

  // --- Notifications ---
  getNotifications(userId = null, role = null, department = null) {
    return this.data.notifications.filter(n => {
      if (userId && n.userId === userId) return true;
      if (role && n.role === role) {
        if (department && n.department && n.department !== department) return false;
        return true;
      }
      if (!userId && !role) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addNotification(notifData) {
    const newNotif = {
      id: `notif-${uuidv4().slice(0, 8)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notifData
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead(userId, role) {
    this.data.notifications.forEach(n => {
      if ((userId && n.userId === userId) || (role && n.role === role)) {
        n.read = true;
      }
    });
    this.save();
  }

  // --- Analytics & SLA Tracking ---
  getAnalytics() {
    const complaints = this.data.complaints;
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const underReview = complaints.filter(c => c.status === 'under_review').length;
    const submitted = complaints.filter(c => c.status === 'submitted').length;
    const escalated = complaints.filter(c => c.isEscalated).length;

    // By Department
    const departmentStats = {};
    this.data.departments.forEach(d => {
      departmentStats[d.id] = {
        name: d.name,
        code: d.code,
        color: d.color,
        total: 0,
        resolved: 0,
        pending: 0,
        slaHours: d.slaHours
      };
    });

    complaints.forEach(c => {
      if (departmentStats[c.department]) {
        departmentStats[c.department].total += 1;
        if (c.status === 'resolved') {
          departmentStats[c.department].resolved += 1;
        } else {
          departmentStats[c.department].pending += 1;
        }
      }
    });

    // Ward-wise breakdown
    const wardMap = {};
    complaints.forEach(c => {
      const ward = c.location?.ward || 'General';
      wardMap[ward] = (wardMap[ward] || 0) + 1;
    });

    // Priority breakdown
    const priorityBreakdown = {
      critical: complaints.filter(c => c.priority === 'critical').length,
      high: complaints.filter(c => c.priority === 'high').length,
      medium: complaints.filter(c => c.priority === 'medium').length,
      low: complaints.filter(c => c.priority === 'low').length
    };

    // Customer satisfaction
    const ratedComplaints = complaints.filter(c => c.feedback && c.feedback.rating);
    const avgRating = ratedComplaints.length > 0
      ? (ratedComplaints.reduce((acc, curr) => acc + curr.feedback.rating, 0) / ratedComplaints.length).toFixed(1)
      : '4.8';

    // Resolution rate
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      total,
      resolved,
      inProgress,
      underReview,
      submitted,
      escalated,
      resolutionRate,
      avgRating,
      ratedCount: ratedComplaints.length,
      departmentStats: Object.values(departmentStats),
      wardDistribution: Object.entries(wardMap).map(([ward, count]) => ({ ward, count })),
      priorityBreakdown
    };
  }
}

module.exports = new StorageAdapter();
