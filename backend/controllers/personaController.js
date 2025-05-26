const { poolPromise, sql } = require('../db');

const crearPersona = async (req, res) => {
    const { nombre, direccion, telefono, nacionalidad, latitud, longitud } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('direccion', sql.VarChar, direccion)
            .input('telefono', sql.VarChar, telefono)
            .input('nacionalidad', sql.VarChar, nacionalidad)
            .input('latitud', sql.Float, latitud)
            .input('longitud', sql.Float, longitud)
            .query(`
                INSERT INTO personas (nombre, direccion, telefono, nacionalidad, latitud, longitud,fecha_creacion)
                VALUES (@nombre, @direccion, @telefono, @nacionalidad, @latitud, @longitud,getdate())
            `);
        res.status(201).json({ message: 'Personas creada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const listarPersona = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Personas ORDER BY fecha_creacion DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const obtenerPersona = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Personas WHERE id = @id');
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const actualizarPersona = async (req, res) => {
    const { nombre, direccion, telefono, nacionalidad, latitud, longitud } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('nombre', sql.VarChar, nombre)
            .input('direccion', sql.VarChar, direccion)
            .input('telefono', sql.VarChar, telefono)
            .input('nacionalidad', sql.VarChar, nacionalidad)
            .input('latitud', sql.Float, latitud)
            .input('longitud', sql.Float, longitud)
            .query(`
                UPDATE Personas
                SET nombre = @nombre,
                    direccion = @direccion,
                    telefono = @telefono,
                    nacionalidad = @nacionalidad,
                    latitud = @latitud,
                    longitud = @longitud
                WHERE id = @id
            `);
        res.json({ message: 'Persona actualizada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const eliminarPersona = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Personas WHERE id = @id');
        res.json({ message: 'Encuesta eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    crearPersona,
    listarPersona,
    obtenerPersona,
    actualizarPersona,
    eliminarPersona
};
