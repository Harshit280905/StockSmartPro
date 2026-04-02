const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 4000;

const authRoutes = require('./routes/auth');
const feedbackRouter = require('./routes/feedbacksRoutes');
const exceptionRouter = require('./middlewares/exceptionHandling');
const thirdPartyMiddlewares = require('./middlewares/thirdPartyMiddlewares');

const inventoryFile = path.join(__dirname, 'data', 'inventory.json');
if (!fs.existsSync(inventoryFile)) fs.writeFileSync(inventoryFile, '[]');

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]'); } catch { return []; }
}
function writeJson(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function statusFromStock(stock) {
  const n = Number(stock || 0);
  if (n <= 0) return 'Out of Stock';
  if (n <= 10) return 'Low Stock';
  return 'In Stock';
}

thirdPartyMiddlewares(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => { console.log(`${req.method} ${req.url}`); next(); });

// ── Auth status (used by React AuthContext) ────────────────────────────────────
app.get('/auth-status', (req, res) => {
  const username = req.cookies?.stocksmart_user || '';
  res.json({ isLoggedIn: Boolean(username), username });
});

// ── Inventory API ──────────────────────────────────────────────────────────────
app.get('/api/inventory', (req, res) => res.json(readJson(inventoryFile)));

app.post('/api/inventory', (req, res) => {
  const items = readJson(inventoryFile);
  const product = {
    id: 'P-' + Date.now().toString().slice(-6),
    name: (req.body.name || '').trim(),
    category: req.body.category || 'Others',
    stock: Number(req.body.stock || 0),
    price: Number(req.body.price || 0),
    description: (req.body.description || '').trim(),
  };
  if (!product.name || !product.description || Number.isNaN(product.stock) || product.stock < 0) {
    return res.status(400).json({ message: 'Invalid product data' });
  }
  product.status = statusFromStock(product.stock);
  items.push(product);
  writeJson(inventoryFile, items);
  res.status(201).json(product);
});

app.patch('/api/inventory/:id/sale', (req, res) => {
  const quantity = Number(req.body.quantity || 0);
  if (quantity <= 0) return res.status(400).json({ message: 'Invalid quantity' });
  const items = readJson(inventoryFile);
  const product = items.find((item) => String(item.id) === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock' });
  product.stock -= quantity;
  product.status = statusFromStock(product.stock);
  writeJson(inventoryFile, items);
  res.json(product);
});

app.delete('/api/inventory/:id', (req, res) => {
  const items = readJson(inventoryFile);
  const filtered = items.filter((item) => String(item.id) !== req.params.id);
  if (filtered.length === items.length) return res.status(404).json({ message: 'Product not found' });
  writeJson(inventoryFile, filtered);
  res.json({ message: 'Deleted successfully' });
});

// ── Auth + Feedback routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRouter);

// ── Serve React build in production ───────────────────────────────────────────
// When you run `npm run build` inside react-frontend/, copy the build/ folder
// here as `public/` and uncomment these two lines:
//
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.use(exceptionRouter);
app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));
