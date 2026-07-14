const express = require('express');
const router = express.Router();
const { getFlags, getFlag, createFlag, updateFlag } = require('../controllers/flagController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getFlags);
router.get('/:id', getFlag);

// Public POST (citizens can submit flags)
router.post('/', createFlag);

// Protected route (only officers can update  flag Status)
router.patch('/:id', authMiddleware, updateFlag);

module.exports = router;