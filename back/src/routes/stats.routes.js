const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { protect, authorize } = require('../middleware/auth');
router.get('/general', statsController.getGeneralStats);
router.get('/owner/:ownerId', protect, authorize('vlasnik'), statsController.getOwnerStats);
module.exports = router;
