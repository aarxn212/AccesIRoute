import { Router } from 'express';
import { pool } from '../db/conexion.js';

const router = Router();

// GET /api/espacios - Listar todos los espacios del centro educativo
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, bloque, planta, tipo, es_accesible, coord_x, coord_y FROM espacios ORDER BY bloque, planta, nombre ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los espacios:', error);
    res.status(500).json({ error: 'Error interno al consultar los espacios' });
  }
});

// GET /api/espacios/:id - Obtener el detalle de un espacio por su identificador
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, bloque, planta, tipo, es_accesible, coord_x, coord_y FROM espacios WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener el espacio ${id}:`, error);
    res.status(500).json({ error: 'Error interno al consultar el espacio' });
  }
});

export default router;
