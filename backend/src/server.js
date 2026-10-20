import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rutasEspacios from './rutas/espacios.js';
import rutasConexiones from './rutas/conexiones.js';
import rutasIncidencias from './rutas/incidencias.js';
import rutasNavegacion from './rutas/rutas.js';

dotenv.config();

const servidor = express();
const puerto = process.env.PORT || process.env.PUERTO || 3001;

servidor.use(cors());
servidor.use(express.json());

servidor.use('/api/espacios', rutasEspacios);
servidor.use('/api/conexiones', rutasConexiones);
servidor.use('/api/incidencias', rutasIncidencias);
servidor.use('/api/rutas', rutasNavegacion);

// Comprobacion rapida de que la API esta levantada
servidor.get('/api/health', (peticion, respuesta) => {
  respuesta.json({
    estado: 'ok',
    proyecto: 'AccessiRoute API',
    project: 'AccessiRoute API',
    fecha: new Date().toISOString()
  });
});

servidor.listen(puerto, () => {
  console.log(`Servidor AccessiRoute escuchando en http://localhost:${puerto}`);
});
