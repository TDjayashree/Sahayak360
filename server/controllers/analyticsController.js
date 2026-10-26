const storage = require('../storage/storageAdapter');

exports.getAnalytics = (req, res) => {
  try {
    const analytics = storage.getAnalytics();
    res.json({
      success: true,
      analytics
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
