const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFilePath = path.join(__dirname, '../data/users.json');
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, '[]');

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8') || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// POST /api/auth/login  → JSON { username }
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'All fields are required.' });

  const users = readUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user)
    return res.status(401).json({ message: 'Invalid credentials.' });

  res.cookie('stocksmart_user', user.username, { httpOnly: true, sameSite: 'lax' });
  return res.json({ message: 'Login successful', username: user.username });
});

// POST /api/auth/register  → JSON { message }
router.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required.' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match.' });

  const users = readUsers();
  if (users.find((u) => u.email === email || u.username === username))
    return res.status(400).json({ message: 'User already exists.' });

  users.push({ username, email, password });
  saveUsers(users);
  return res.status(201).json({ message: 'Account created successfully.' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('stocksmart_user');
  return res.json({ message: 'Logged out.' });
});

// GET /api/auth/user/:id
router.get('/user/:id', (req, res) => {
  const users = readUsers();
  const user = users.find((_, i) => i + 1 === Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safeUser } = user;   // never send password back
  res.json(safeUser);
});

module.exports = router;
