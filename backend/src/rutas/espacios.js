import { Router } from 'express';
import { pool } from '../db/conexion.js';

const enrutador = Router();

// Devuelve todos los espacios ordenados por bloque y planta
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const { rows: espacios } = await pool.query(
      'SELECT id, nombre, bloque, planta, tipo, es_accesible, coord_x, coord_y FROM espacios ORDER BY bloque, planta, nombre ASC'
    );
    respuesta.json(espacios);
  } catch (error) {
    console.error('Error al obtener los espacios:', error);
    respuesta.status(500).json({ error: 'Error al consultar los espacios en la base de datos' });
  }
});

// Busca un espacio concreto por su identificador
enrutador.get('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;
  try {
    const { rows: resultado } = await pool.query(
      'SELECT id, nombre, bloque, planta, tipo, es_accesible, coord_x, coord_y FROM espacios WHERE id = $1',
      [id]
    );

    if (resultado.length === 0) {
      return respuesta.status(404).json({ error: 'Espacio no encontrado' });
    }

    respuesta.json(resultado[0]);
  } catch (error) {
    console.error(`Error al obtener el espacio ${id}:`, error);
    respuesta.status(500).json({ error: 'Error al consultar el espacio' });
  }
});

export default enrutador;
