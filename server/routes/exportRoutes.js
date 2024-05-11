const express = require('express');
const router = express.Router();

const { pptxExport } = require('../controllers/exportController.js')
  
router.get('/pptx/:id', pptxExport);

module.exports = router;
