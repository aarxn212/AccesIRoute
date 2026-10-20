import { Router } from 'express';
import { pool } from '../db/conexion.js';

const enrutador = Router();

const TIPOS_VALIDOS = ['obstaculo', 'ascensor', 'puerta', 'rampa', 'paso_bloqueado', 'otro'];

// Lista incidencias (por defecto las activas para el mapa y la IA)
enrutador.get('/', async (peticion, respuesta) => {
  const { estado = 'activa' } = peticion.query;

  try {
    let consultaSql = `
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

    const parametros = [];
    if (estado !== 'todas') {
      consultaSql += ' WHERE i.estado = $1';
      parametros.push(estado);
    }

    consultaSql += ' ORDER BY i.creado_en DESC;';

    const { rows: incidencias } = await pool.query(consultaSql, parametros);
    respuesta.json(incidencias);
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    respuesta.status(500).json({ error: 'Error al consultar las incidencias' });
  }
});

// Registra un nuevo reporte tactil estilo Waze
enrutador.post('/', async (peticion, respuesta) => {
  const { id_espacio, tipo, descripcion = '', coord_x = null, coord_y = null } = peticion.body;

  if (!id_espacio || !tipo) {
    return respuesta.status(400).json({ error: 'Falta indicar el espacio y el tipo de problema' });
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return respuesta.status(400).json({ 
      error: `Tipo no valido. Debe ser: ${TIPOS_VALIDOS.join(', ')}` 
    });
  }

  try {
    const espacioExiste = await pool.query('SELECT id FROM espacios WHERE id = $1', [id_espacio]);
    if (espacioExiste.rows.length === 0) {
      return respuesta.status(404).json({ error: 'El espacio indicado no existe' });
    }

    const consultaSql = `
      INSERT INTO incidencias (id_espacio, tipo, descripcion, estado, coord_x, coord_y)
      VALUES ($1, $2, $3, 'activa', $4, $5)
      RETURNING *;
    `;

    const { rows: resultado } = await pool.query(consultaSql, [id_espacio, tipo, descripcion, coord_x, coord_y]);
    respuesta.status(201).json({
      mensaje: 'Incidencia reportada correctamente',
      incidencia: resultado[0]
    });
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    respuesta.status(500).json({ error: 'Error al registrar la incidencia' });
  }
});

// Marca una incidencia como solucionada
enrutador.patch('/:id/resolver', async (peticion, respuesta) => {
  const { id } = peticion.params;

  try {
    const consultaSql = `
      UPDATE incidencias 
      SET estado = 'resuelta' 
      WHERE id = $1 
      RETURNING *;
    `;

    const { rows: resultado } = await pool.query(consultaSql, [id]);

    if (resultado.length === 0) {
      return respuesta.status(404).json({ error: 'Incidencia no encontrada' });
    }

    respuesta.json({
      mensaje: 'Incidencia marcada como resuelta',
      incidencia: resultado[0]
    });
  } catch (error) {
    console.error(`Error al resolver incidencia ${id}:`, error);
    respuesta.status(500).json({ error: 'Error al resolver la incidencia' });
  }
});

// Elimina una incidencia
enrutador.delete('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;

  try {
    const { rows: resultado } = await pool.query('DELETE FROM incidencias WHERE id = $1 RETURNING *;', [id]);

    if (resultado.length === 0) {
      return respuesta.status(404).json({ error: 'Incidencia no encontrada' });
    }

    respuesta.json({ mensaje: 'Incidencia eliminada correctamente' });
  } catch (error) {
    console.error(`Error al eliminar incidencia ${id}:`, error);
    respuesta.status(500).json({ error: 'Error al eliminar la incidencia' });
  }
});

export default enrutador;
