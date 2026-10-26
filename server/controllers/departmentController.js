const storage = require('../storage/storageAdapter');

exports.getDepartments = (req, res) => {
  try {
    const departments = storage.getDepartments();
    res.json({
      success: true,
      departments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDepartmentById = (req, res) => {
  try {
    const dept = storage.getDepartmentById(req.params.id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, department: dept });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
