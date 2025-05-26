const express = require('express');
const router = express.Router();
const {
    crearPersona,
    listarPersona,
    obtenerPersona,
    actualizarPersona,
    eliminarPersona
} = require('../controllers/personaController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', crearPersona);
router.get('/', listarPersona);
router.get('/:id', obtenerPersona);
router.put('/:id', actualizarPersona);
router.delete('/:id', eliminarPersona);

module.exports = router;
