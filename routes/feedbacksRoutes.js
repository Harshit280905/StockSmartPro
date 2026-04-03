const express = require('express');
const fs = require('fs');
const path = require('path');
const feedbackRouter = express.Router();

const feedbackFilePath = path.join(__dirname, '../data/feedback.json');
if (!fs.existsSync(feedbackFilePath)) fs.writeFileSync(feedbackFilePath, '[]');

feedbackRouter.use((req, res, next) => {
  console.log(`Feedback Route: ${req.method} ${req.url}`);
  next();
});

// POST /api/feedback
feedbackRouter.post('/', (req, res) => {
  const { name, email, reason, useful } = req.body;
  const firstTime = req.body['first-time'];

  if (!name || !email || !firstTime || !useful)
    return res.status(400).json({ message: 'All required feedback fields must be filled.' });

  let feedbacks = [];
  try {
    feedbacks = JSON.parse(fs.readFileSync(feedbackFilePath, 'utf-8') || '[]');
  } catch {
    feedbacks = [];
  }

  feedbacks.push({
    id: 'FB-' + Date.now().toString().slice(-6),
    name,
    email,
    firstTime,
    reason: reason || '',
    useful,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbacks, null, 2));
  res.json({ message: 'Feedback submitted successfully!' });
});

// GET /api/feedback  (admin view, optional)
feedbackRouter.get('/', (req, res) => {
  try {
    const feedbacks = JSON.parse(fs.readFileSync(feedbackFilePath, 'utf-8') || '[]');
    res.json(feedbacks);
  } catch {
    res.json([]);
  }
});

module.exports = feedbackRouter;
