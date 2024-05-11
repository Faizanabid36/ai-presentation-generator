const express = require('express');
const router = express.Router();
const sectionController = require("../controllers/sectionController.js");

router.post('/title/generate', sectionController.titleGenerate);

module.exports = router;
