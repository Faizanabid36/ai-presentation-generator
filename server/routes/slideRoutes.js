const express = require('express');
const router = express.Router();
const slideController = require("../controllers/slideController.js")
 
// SPLIT INTO SECTIONS AND SLIDES YOU FUCK

router.post('/title/generate', slideController.titleGenerate)
router.post('/content/generate', slideController.contentGenerate)

module.exports = router;
