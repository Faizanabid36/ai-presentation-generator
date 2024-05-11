const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController.js');

router.post('/title/generate', slideController.titleGenerate);
router.post('/content/generate', slideController.contentGenerate);

module.exports = router;
