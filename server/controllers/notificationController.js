const storage = require('../storage/storageAdapter');

exports.getNotifications = (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    const role = req.user?.role || req.query.role;
    const department = req.user?.department || req.query.department;

    const notifications = storage.getNotifications(userId, role, department);
    res.json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length,
      notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markRead = (req, res) => {
  try {
    const { id } = req.params;
    const notif = storage.markNotificationRead(id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAllRead = (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const role = req.user?.role || req.body.role;
    storage.markAllNotificationsRead(userId, role);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
