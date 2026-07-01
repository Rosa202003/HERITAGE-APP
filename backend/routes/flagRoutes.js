const express = require('express');
const router = express.Router();
const { getFlags, getFlag, createFlag, updateFlag } = require("../controllers/flagController");

router.get('/', getFlags);
router.get('/:id', getFlag);
router.post('/', createFlag);
router.patch('/:id', updateFlag);

module.exports = router;