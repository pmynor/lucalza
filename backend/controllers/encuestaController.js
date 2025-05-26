// controllers/definicionEncuestaController.js
const { poolPromise, sql } = require('../db');


const actualizarEncuesta = async (req, res) => {
  const encuestaId = req.params.id;
  const { preguntas } = req.body;

  if (!Array.isArray(preguntas) || preguntas.length === 0) {
    return res.status(400).json({ message: 'Debe enviar preguntas válidas.' });
  }

  try {
    const pool = await poolPromise;

    // 1. Eliminar relaciones antiguas
    await pool.request()
      .input('encuesta_id', sql.Int, encuestaId)
      .query('DELETE FROM EncuestaPregunta WHERE encuesta_id = @encuesta_id');

    for (const texto of preguntas) {
      // Verificar si ya existe la pregunta
      const result = await pool.request()
        .input('texto', sql.VarChar, texto)
        .query('SELECT id FROM Preguntas WHERE texto = @texto');

      let preguntaId;

      if (result.recordset.length > 0) {
        preguntaId = result.recordset[0].id;
      } else {
        const insertResult = await pool.request()
          .input('texto', sql.VarChar, texto)
          .query('INSERT INTO Preguntas (texto) OUTPUT INSERTED.id VALUES (@texto)');
        preguntaId = insertResult.recordset[0].id;
      }

      // Insertar nueva relación
      await pool.request()
        .input('encuesta_id', sql.Int, encuestaId)
        .input('pregunta_id', sql.Int, preguntaId)
        .query('INSERT INTO EncuestaPregunta (encuesta_id, pregunta_id) VALUES (@encuesta_id, @pregunta_id)');
    }

    res.json({ message: 'Encuesta actualizada correctamente.' });
  } catch (err) {
    console.error('Error al actualizar encuesta:', err);
    res.status(500).json({ message: 'Error al actualizar encuesta', error: err.message });
  }
};


const listarEncuestas = async (req, res) => {
  try {
    const pool = await poolPromise;

    const encuestasResult = await pool.request().query('SELECT * FROM Encuestas');
    const relacionesResult = await pool.request().query('SELECT * FROM EncuestaPregunta');
    const preguntasResult = await pool.request().query('SELECT * FROM Preguntas');

    const encuestas = encuestasResult.recordset;
    const relaciones = relacionesResult.recordset;
    const preguntas = preguntasResult.recordset;

    const encuestasConPreguntas = encuestas.map(encuesta => {
      const preguntaIds = relaciones
        .filter(r => r.encuesta_id === encuesta.id)
        .map(r => r.pregunta_id);

      const preguntasEncuesta = preguntas
        .filter(p => preguntaIds.includes(p.id))
        .map(p => ({
          id: p.id,
          texto: p.texto
        }));

      return {
        id: encuesta.id,
        titulo: encuesta.titulo,
        descripcion: encuesta.descripcion,
        preguntas: preguntasEncuesta
      };
    });

    res.json(encuestasConPreguntas);
  } catch (err) {
    console.error('Error al obtener encuestas:', err);
    res.status(500).json({ message: 'Error al obtener encuestas', error: err.message });
  }
};

const eliminarEncuesta = async (req, res) => {
  const encuestaId = req.params.id;

  try {
    const pool = await poolPromise;

    // Eliminar respuestas relacionadas
    await pool.request()
      .input('encuestaId', sql.Int, encuestaId)
      .query('DELETE FROM Respuestas WHERE encuesta_id = @encuestaId');

    // Eliminar relaciones de preguntas
    await pool.request()
      .input('encuestaId', sql.Int, encuestaId)
      .query('DELETE FROM EncuestaPregunta WHERE encuesta_id = @encuestaId');

    // Eliminar la encuesta
    await pool.request()
      .input('encuestaId', sql.Int, encuestaId)
      .query('DELETE FROM Encuestas WHERE id = @encuestaId');

    res.json({ message: 'Encuesta eliminada correctamente.' });
  } catch (err) {
    console.error('Error al eliminar encuesta:', err);
    res.status(500).json({ message: 'Error al eliminar encuesta', error: err.message });
  }
};





const crearDefinicionEncuesta = async (req, res) => {
  const { titulo, descripcion, preguntas } = req.body;

  if (!titulo || !Array.isArray(preguntas)) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  try {
    const pool = await poolPromise;

    // 1. Crear encuesta
    const encuestaResult = await pool.request()
      .input('titulo', sql.VarChar, titulo)
      .input('descripcion', sql.VarChar, descripcion)
      .query(`INSERT INTO Encuestas (titulo, descripcion) OUTPUT INSERTED.id VALUES (@titulo, @descripcion)`);

    const encuestaId = encuestaResult.recordset[0].id;

    // 2. Asociar preguntas
    for (const texto of preguntas) {
      let preguntaId;
      const preguntaExistente = await pool.request()
        .input('texto', sql.VarChar, texto)
        .query(`SELECT id FROM Preguntas WHERE texto = @texto`);

      if (preguntaExistente.recordset.length > 0) {
        preguntaId = preguntaExistente.recordset[0].id;
      } else {
        const insert = await pool.request()
          .input('texto', sql.VarChar, texto)
          .query(`INSERT INTO Preguntas (texto) OUTPUT INSERTED.id VALUES (@texto)`);
        preguntaId = insert.recordset[0].id;
      }

      await pool.request()
        .input('encuestaId', sql.Int, encuestaId)
        .input('preguntaId', sql.Int, preguntaId)
        .query(`INSERT INTO EncuestaPregunta (encuesta_id, pregunta_id) VALUES (@encuestaId, @preguntaId)`);
    }

    res.status(201).json({ mensaje: 'Encuesta creada con preguntas', id: encuestaId });

  } catch (err) {
    console.error('Error al crear definición de encuesta:', err);
    res.status(500).json({ mensaje: 'Error al crear la encuesta' });
  }
};

const obtenerEstadisticasPorEncuesta  = async (req, res) => {
  const encuestaId = req.params.id;

  try {
      const pool = await poolPromise;
      const resultado = await pool.request()
      .input('encuestaId', sql.Int, encuestaId)
      .query(`
        SELECT 
          e.id AS encuesta_id,
          e.titulo AS encuesta,
          p.id AS pregunta_id,
          p.texto AS pregunta,
          r.valor,
          COUNT(*) AS cantidad_respuestas
        FROM Respuestas r
        JOIN Preguntas p ON r.pregunta_id = p.id
        JOIN Encuestas e ON r.encuesta_id = e.id
        WHERE e.id = @encuestaId
        GROUP BY e.id, e.titulo, p.id, p.texto, r.valor
        ORDER BY p.id, r.valor;
      `);

    res.json(resultado.recordset);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
  }
};

module.exports = { crearDefinicionEncuesta,listarEncuestas,eliminarEncuesta,actualizarEncuesta,obtenerEstadisticasPorEncuesta };
