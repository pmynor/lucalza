const sql = require('mssql');
const { poolPromise } = require('../db');

const responderEncuesta = async (req, res) => {
  const respuestas = req.body;

  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    return res.status(400).json({ message: 'Datos inválidos.' });
  }

  try {
    const pool = await poolPromise;

    for (const r of respuestas) {
      await pool.request()
        .input('persona_id', sql.Int, r.personaId)
        .input('encuesta_id', sql.Int, r.encuestaId)
        .input('pregunta_id', sql.Int, r.preguntaId)
        .input('valor', sql.Int, r.valor)
        .query(`
          INSERT INTO Respuestas (persona_id, encuesta_id, pregunta_id, valor)
          VALUES (@persona_id, @encuesta_id, @pregunta_id, @valor)
        `);
    }

    res.status(201).json({ message: 'Respuestas guardadas correctamente' });
  } catch (err) {
    console.error('Error al guardar respuestas:', err);
    res.status(500).json({ message: 'Error al guardar respuestas', error: err.message });
  }
};

module.exports = { responderEncuesta };
