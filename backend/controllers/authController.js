const { poolPromise, sql } = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM Usuarios WHERE usuario = @usuario AND password = @password');

        if (result.recordset.length > 0) {
            const token = jwt.sign({ usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login };
