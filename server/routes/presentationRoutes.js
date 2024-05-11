const express = require('express');
const router = express.Router();
const presentationController = require("../controllers/presentationController.js")

// C R U D

router.put('/', presentationController.create)

router.get('/', presentationController.readAll)
router.get('/:id', presentationController.readOne)

// UPDATE
router.post('/:id', presentationController.update)

router.delete('/', presentationController.deleteAll)
router.delete('/:id', presentationController.deleteOne)

// GENERATE IN LAYERS
router.post('/generate', presentationController.generate)

module.exports = router;
