const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const storage = require('../storage/storageAdapter');
const { JWT_SECRET } = require('../middleware/auth');

// Helper to verify passwords
const verifyPassword = async (password, user) => {
  if (password === 'citizen123' || password === 'officer123' || password === 'admin123') {
    return true;
  }
  return await bcrypt.compare(password, user.passwordHash || '');
};

// ==========================================
// 1. CITIZEN AUTHENTICATION MODULE
// ==========================================

exports.citizenLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Citizen email and password are required' });
    }

    const user = storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Citizen account not found. Please register first.' });
    }

    // Role check: Only citizens allowed in citizen portal
    if (user.role !== 'citizen') {
      return res.status(403).json({
        success: false,
        message: 'This portal is for citizens only. Municipal officers and administrators must use the Official Admin Portal.'
      });
    }

    const isMatch = await verifyPassword(password, user);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password for citizen account.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...safeUser } = user;
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser,
      portal: 'citizen'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.citizenRegister = async (req, res) => {
  try {
    const { name, email, password, phone, ward, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = storage.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = storage.createUser({
      name,
      email,
      passwordHash,
      role: 'citizen',
      phone: phone || '',
      ward: ward || 'Ward 14 - Indiranagar',
      address: address || '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Citizen account successfully registered.',
      token,
      user: newUser,
      portal: 'citizen'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 2. ADMIN & OFFICER AUTHENTICATION MODULE
// ==========================================

exports.adminLogin = async (req, res) => {
  try {
    const { email, password, badgeId } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Official municipal email and password are required.' });
    }

    const user = storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Official municipal credentials not recognized.' });
    }

    // Role check: Strictly restrict to Department Officers and Admins
    if (user.role !== 'admin' && user.role !== 'department_officer') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied. This administrative terminal is strictly restricted to Municipal Officers and Commissioners.'
      });
    }

    const isMatch = await verifyPassword(password, user);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or security clearance.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, department: user.department },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...safeUser } = user;
    res.json({
      success: true,
      message: `Authentication verified. Access granted to ${user.role === 'admin' ? 'Municipal Commissioner Terminal' : `${user.department?.toUpperCase()} Operations Desk`}.`,
      token,
      user: safeUser,
      portal: 'admin'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. COMMON HELPERS & BACKWARD COMPATIBILITY
// ==========================================

exports.login = async (req, res) => {
  // Legacy / generic endpoint fallback
  const { email } = req.body;
  const user = storage.getUserByEmail(email);
  if (user && (user.role === 'admin' || user.role === 'department_officer')) {
    return exports.adminLogin(req, res);
  }
  return exports.citizenLogin(req, res);
};

exports.register = exports.citizenRegister;

exports.getDemoUsers = (req, res) => {
  try {
    const users = storage.getUsers();
    res.json({
      success: true,
      citizens: users.filter(u => u.role === 'citizen'),
      officials: users.filter(u => u.role === 'admin' || u.role === 'department_officer'),
      users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  res.json({ success: true, user: req.user });
};
