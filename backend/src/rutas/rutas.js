import { Router } from 'express';
import { calcularRutaConIA } from '../servicios/iaRutas.js';

const enrutador = Router();

// Endpoint para pedir a la IA que calcule una ruta adaptada
enrutador.post('/consultar', async (peticion, respuesta) => {
  const { peticionUsuario = '', idOrigen = null, idDestino = null, soloAccesible = false } = peticion.body;

  if (!peticionUsuario && (!idOrigen || !idDestino)) {
    return respuesta.status(400).json({
      error: 'Debes indicar una peticion en texto o seleccionar origen y destino'
    });
  }

  try {
    const rutaCalculada = await calcularRutaConIA({
      peticionUsuario,
      idOrigenForzado: idOrigen,
      idDestinoForzado: idDestino,
      soloAccesible
    });

    respuesta.json(rutaCalculada);
  } catch (error) {
    console.error('Error al calcular ruta con IA:', error);
    respuesta.status(500).json({
      error: error.message || 'Error al procesar la ruta con el motor de IA'
    });
  }
});

export default enrutador;
