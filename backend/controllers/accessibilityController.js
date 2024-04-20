// backend/controllers/accessibilityController.js
const websiteScanner = require('../services/websiteScanner');

// Controller for scanning website for accessibility compliance
const scanWebsite = async (req, res, next) => {
  const { url } = req.body;
  try {
    // Call service to scan website
    const accessibilityReport = await websiteScanner.scan(url);
    // Save accessibility report to database or return it to frontend
    res.json(accessibilityReport);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanWebsite,
};
