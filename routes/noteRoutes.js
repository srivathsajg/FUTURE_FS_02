const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { addNote } = require('../controllers/noteController');

router.post('/:leadId', requireAuth, addNote);

module.exports = router;

