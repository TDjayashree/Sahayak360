const storage = require('../storage/storageAdapter');

exports.getAllComplaints = (req, res) => {
  try {
    const { department, status, priority, citizenId, search } = req.query;
    const complaints = storage.getComplaints({
      department,
      status,
      priority,
      citizenId,
      search
    });

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getComplaintByIdOrTracking = (req, res) => {
  try {
    const { id } = req.params;
    const complaint = storage.getComplaintById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: `Grievance with ID "${id}" was not found.` });
    }

    res.json({
      success: true,
      complaint
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createComplaint = (req, res) => {
  try {
    const {
      title,
      description,
      department,
      category,
      priority = 'medium',
      location,
      citizen,
      attachments = []
    } = req.body;

    if (!title || !description || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, and civic department category are required.' 
      });
    }

    // Determine citizen details from session or payload
    const citizenInfo = {
      id: req.user?.id || citizen?.id || 'guest-citizen',
      name: req.user?.name || citizen?.name || 'Anonymous Citizen',
      phone: req.user?.phone || citizen?.phone || '+91 99999 00000',
      email: req.user?.email || citizen?.email || 'citizen@portal.in'
    };

    const newComplaint = storage.createComplaint({
      title,
      description,
      department,
      category,
      priority,
      location: location || { address: 'General Municipal Ward', ward: 'Ward 1' },
      citizen: citizenInfo,
      attachments
    });

    res.status(201).json({
      success: true,
      message: 'Civic grievance successfully registered and routed.',
      complaint: newComplaint
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, statusTitle, resolutionNote, proofImage } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const updater = req.user ? `${req.user.name} (${req.user.role === 'admin' ? 'Municipal Admin' : 'Dept Officer'})` : 'Municipal Officer';

    const updates = {
      status,
      note,
      statusTitle
    };

    if (status === 'resolved') {
      updates.resolution = {
        resolutionNote: resolutionNote || note || 'Resolved successfully by civic maintenance team.',
        proofImage: proofImage || null
      };
    }

    const updated = storage.updateComplaint(id, updates, updater);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: `Status updated to ${status}.`,
      complaint: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignOfficer = (req, res) => {
  try {
    const { id } = req.params;
    const { officerId, officerName } = req.body;

    if (!officerName) {
      return res.status(400).json({ success: false, message: 'Officer name is required for assignment.' });
    }

    const updater = req.user ? req.user.name : 'Municipal Supervisor';
    const updated = storage.updateComplaint(
      id,
      {
        status: 'in_progress',
        statusTitle: 'Task Assigned & Dispatched',
        note: `Assigned to ${officerName} for on-site inspection and repair.`,
        assignedTo: {
          officerId: officerId || 'officer-assigned',
          officerName,
          assignedAt: new Date().toISOString()
        }
      },
      updater
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: 'Officer assigned successfully.',
      complaint: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitFeedback = (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
    }

    const updated = storage.updateComplaint(
      id,
      {
        feedback: {
          rating: Number(rating),
          comment: comment || ''
        }
      },
      req.user ? req.user.name : 'Citizen'
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: 'Thank you for your feedback! Your rating helps improve civic service quality.',
      complaint: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.rerouteDepartment = (req, res) => {
  try {
    const { id } = req.params;
    const { department, reason } = req.body;

    if (!department) {
      return res.status(400).json({ success: false, message: 'New department is required.' });
    }

    const updater = req.user ? `${req.user.name} (Admin)` : 'Municipal Administrator';
    const updated = storage.updateComplaint(
      id,
      {
        department,
        note: reason ? `Re-routed: ${reason}` : 'Re-routed by admin oversight.'
      },
      updater
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: `Complaint re-routed to ${department}.`,
      complaint: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }

    const uploadedFiles = req.files.map(file => {
      // In dev and prod, serve via /uploads/ filename
      const url = `/uploads/${file.filename}`;
      return {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url
      };
    });

    res.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully.`,
      files: uploadedFiles
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
