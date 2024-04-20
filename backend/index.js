// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const accessibilityRoutes = require('./routes/accessibilityRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
mongoose.connect('mongodb+srv://notesinfinity0061:infinity164244@cluster0.c2rsni5.mongodb.net/accessibility_checker', {
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Log MongoDB connection status
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully!');
});

// Routes
app.use('/api/accessibility', accessibilityRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
