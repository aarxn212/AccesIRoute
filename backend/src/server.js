import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rutasEspacios from './rutas/espacios.js';
import rutasConexiones from './rutas/conexiones.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/espacios', rutasEspacios);
app.use('/api/conexiones', rutasConexiones);

// Endpoint de comprobación
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'AccessiRoute API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor AccessiRoute escuchando en http://localhost:${PORT}`);
});
