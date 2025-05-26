const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { responderEncuesta } = require('../controllers/respuestaController');

router.post('/', verifyToken, responderEncuesta);

module.exports = router;
