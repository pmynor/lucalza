const { poolPromise, sql } = require('../db');

const crearDefinicionEncuesta = async (req, res) => {
  const { titulo, descripcion, preguntas } = req.body;

  if (!titulo || !Array.isArray(preguntas)) {
    return res.status(400).json({ mensaje: 'Faltan título o preguntas' });
  }

  try {
    const pool = await poolPromise;

    // Crear encuesta
    const encuestaResult = await pool.request()
      .input('titulo', sql.VarChar, titulo)
      .input('descripcion', sql.VarChar, descripcion)
      .query(`INSERT INTO Encuestas (titulo, descripcion) OUTPUT INSERTED.id VALUES (@titulo, @descripcion)`);

    const encuestaId = encuestaResult.recordset[0].id;

    // Agregar preguntas y relaciones
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
    console.error('Error al crear encuesta:', err);
    res.status(500).json({ mensaje: 'Error al crear la encuesta' });
  }
};

module.exports = { crearDefinicionEncuesta };
