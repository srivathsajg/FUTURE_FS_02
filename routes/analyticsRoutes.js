const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { getStats } = require('../controllers/analyticsController');

router.get('/stats', requireAuth, getStats);

module.exports = router;

