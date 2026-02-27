const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { createLead, getLeads, getLeadById, updateLead, deleteLead } = require('../controllers/leadController');

router.post('/', requireAuth, createLead);
router.get('/', requireAuth, getLeads);
router.get('/:id', requireAuth, getLeadById);
router.put('/:id', requireAuth, updateLead);
router.delete('/:id', requireAuth, deleteLead);

module.exports = router;

