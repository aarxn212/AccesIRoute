import { Router } from 'express';
import { pool } from '../db/conexion.js';

const enrutador = Router();

// Devuelve el grafo de conexiones entre aulas y pasillos
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const consultaSql = `
      SELECT 
        c.id,
        c.id_espacio_origen,
        eo.nombre AS nombre_origen,
        eo.bloque AS bloque_origen,
        eo.planta AS planta_origen,
        eo.coord_x AS coord_x_origen,
        eo.coord_y AS coord_y_origen,
        c.id_espacio_destino,
        ed.nombre AS nombre_destino,
        ed.bloque AS bloque_destino,
        ed.planta AS planta_destino,
        ed.coord_x AS coord_x_destino,
        ed.coord_y AS coord_y_destino,
        c.tipo_conexion,
        c.es_accesible
      FROM conexiones c
      JOIN espacios eo ON c.id_espacio_origen = eo.id
      JOIN espacios ed ON c.id_espacio_destino = ed.id
      ORDER BY c.id ASC;
    `;

    const { rows: conexiones } = await pool.query(consultaSql);
    respuesta.json(conexiones);
  } catch (error) {
    console.error('Error al obtener conexiones:', error);
    respuesta.status(500).json({ error: 'Error al consultar las conexiones del grafo' });
  }
});

export default enrutador;
