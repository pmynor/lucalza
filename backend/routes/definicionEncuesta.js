const express = require('express');
const router = express.Router();
const { crearDefinicionEncuesta } = require('../controllers/definicionEncuestaController');
const { listarEncuestas } = require('../controllers/encuestaController');
const { eliminarEncuesta } = require('../controllers/encuestaController');
const { actualizarEncuesta } = require('../controllers/encuestaController');
const { obtenerEstadisticasPorEncuesta } = require('../controllers/encuestaController');



const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);
router.post('/', crearDefinicionEncuesta);
router.get('/', listarEncuestas);
router.delete('/:id',eliminarEncuesta);
router.put('/:id',  actualizarEncuesta);
router.get('/:id/estadisticas',obtenerEstadisticasPorEncuesta);




module.exports = router;
