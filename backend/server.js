const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Importar rutas
const encuestaRoutes = require('./routes/definicionEncuesta');
const personaRoutes = require('./routes/personas');
const respuestaRoutes = require('./routes/respuestas');
const estadisticas = require('./routes/definicionEncuesta');
const authRoutes = require('./routes/auth');

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // O coloca el dominio exacto de tu frontend
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // ✅ Responde sin pedir token
  }
  next();
});

// Rutas públicas y protegidas
app.use('/api/auth', authRoutes);
app.use('/api/encuestas', encuestaRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/respuestas', respuestaRoutes);
app.use('/api/estadistica', estadisticas);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
