import { Router } from 'express';
import { calcularRutaConIA } from '../servicios/iaRutas.js';

const router = Router();

// POST /api/rutas/consultar - Proponer una ruta asistida por Gemini IA
router.post('/consultar', async (req, res) => {
  const { peticionUsuario = '', idOrigen = null, idDestino = null, soloAccesible = false } = req.body;

  if (!peticionUsuario && (!idOrigen || !idDestino)) {
    return res.status(400).json({
      error: 'Debes indicar una petición en texto/voz o seleccionar origen y destino.'
    });
  }

  try {
    const rutaCalculada = await calcularRutaConIA({
      peticionUsuario,
      idOrigenForzado: idOrigen,
      idDestinoForzado: idDestino,
      soloAccesible
    });

    res.json(rutaCalculada);
  } catch (error) {
    console.error('Error al calcular ruta con IA:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar la ruta con IA'
    });
  }
});

export default router;
