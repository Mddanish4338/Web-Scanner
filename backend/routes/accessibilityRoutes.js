// backend/routes/accessibilityRoutes.js
const express = require('express');
const router = express.Router();
const accessibilityController = require('../controllers/accessibilityController');

// Route for scanning website for accessibility compliance
router.post('/scan', accessibilityController.scanWebsite);

module.exports = router;
