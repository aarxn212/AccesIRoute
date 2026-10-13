import { Router } from 'express';
import { pool } from '../db/conexion.js';

const router = Router();

// Tipos permitidos según el requerimiento de Waze
const TIPOS_VALIDOS = ['obstaculo', 'ascensor', 'puerta', 'rampa', 'paso_bloqueado', 'otro'];

// GET /api/incidencias - Listar incidencias (por defecto activas)
router.get('/', async (req, res) => {
  const { estado = 'activa' } = req.query;

  try {
    let consulta = `
      SELECT 
        i.id,
        i.id_espacio,
        e.nombre AS nombre_espacio,
        e.bloque,
        e.planta,
        i.tipo,
        i.descripcion,
        i.estado,
        i.coord_x,
        i.coord_y,
        i.creado_en
      FROM incidencias i
      JOIN espacios e ON i.id_espacio = e.id
    `;

    const params = [];
    if (estado !== 'todas') {
      consulta += ' WHERE i.estado = $1';
      params.push(estado);
    }

    consulta += ' ORDER BY i.creado_en DESC;';

    const { rows } = await pool.query(consulta, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).json({ error: 'Error interno al consultar incidencias' });
  }
});

// POST /api/incidencias - Crear reporte rápido de incidencia (estilo Waze)
router.post('/', async (req, res) => {
  const { id_espacio, tipo, descripcion = '', coord_x = null, coord_y = null } = req.body;

  // Validación básica
  if (!id_espacio || !tipo) {
    return res.status(400).json({ error: 'id_espacio y tipo son obligatorios' });
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ 
      error: `Tipo no válido. Debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` 
    });
  }

  try {
    // Comprobar que el espacio existe
    const espacioExiste = await pool.query('SELECT id FROM espacios WHERE id = $1', [id_espacio]);
    if (espacioExiste.rows.length === 0) {
      return res.status(404).json({ error: 'El espacio indicado no existe' });
    }

    const consulta = `
      INSERT INTO incidencias (id_espacio, tipo, descripcion, estado, coord_x, coord_y)
      VALUES ($1, $2, $3, 'activa', $4, $5)
      RETURNING *;
    `;

    const { rows } = await pool.query(consulta, [id_espacio, tipo, descripcion, coord_x, coord_y]);
    res.status(201).json({
      mensaje: 'Incidencia reportada correctamente',
      incidencia: rows[0]
    });
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(500).json({ error: 'Error interno al registrar la incidencia' });
  }
});

// PATCH /api/incidencias/:id/resolver - Marcar una incidencia como resuelta
router.patch('/:id/resolver', async (req, res) => {
  const { id } = req.params;

  try {
    const consulta = `
      UPDATE incidencias 
      SET estado = 'resuelta' 
      WHERE id = $1 
      RETURNING *;
    `;

    const { rows } = await pool.query(consulta, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    res.json({
      mensaje: 'Incidencia marcada como resuelta',
      incidencia: rows[0]
    });
  } catch (error) {
    console.error(`Error al resolver incidencia ${id}:`, error);
    res.status(500).json({ error: 'Error interno al resolver la incidencia' });
  }
});

// DELETE /api/incidencias/:id - Eliminar incidencia (administración)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('DELETE FROM incidencias WHERE id = $1 RETURNING *;', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    res.json({ mensaje: 'Incidencia eliminada correctamente' });
  } catch (error) {
    console.error(`Error al eliminar incidencia ${id}:`, error);
    res.status(500).json({ error: 'Error interno al eliminar la incidencia' });
  }
});

export default router;
