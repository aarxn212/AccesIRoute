import { GoogleGenAI, Type } from '@google/genai';
import { pool } from '../db/conexion.js';
import dotenv from 'dotenv';

dotenv.config();

const esquemaRespuestaRuta = {
  type: Type.OBJECT,
  properties: {
    origen: {
      type: Type.STRING,
      description: 'Identificador del espacio origen de la lista proporcionada'
    },
    destino: {
      type: Type.STRING,
      description: 'Identificador del espacio destino de la lista proporcionada'
    },
    ruta: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Secuencia ordenada exacta de identificadores de espacios que forman el camino paso a paso desde el origen hasta el destino'
    },
    barreras_evitadas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Espacios o conexiones con barreras o incidencias que se han evitado activamente (ej. escaleras o ascensores averiados)'
    },
    motivo: {
      type: Type.STRING,
      description: 'Explicación clara y accesible en español sobre la ruta propuesta'
    }
  },
  required: ['origen', 'destino', 'ruta', 'barreras_evitadas', 'motivo']
};

/**
 * Calcula una ruta adaptada usando Gemini API basándose en el grafo de PostgreSQL
 * @param {string} peticionUsuario - Petición en lenguaje natural del usuario (ej: "Quiero ir de la entrada al aula A-12 en silla de ruedas")
 * @param {string} idOrigenForzado - (Opcional) Si el usuario o panel fija un origen
 * @param {string} idDestinoForzado - (Opcional) Si el usuario fija un destino
 * @param {boolean} soloAccesible - Si el usuario requiere movilidad reducida / sin barreras
 */
export async function calcularRutaConIA({ peticionUsuario, idOrigenForzado = null, idDestinoForzado = null, soloAccesible = false }) {
  // 1. Obtener datos actualizados de PostgreSQL
  const { rows: espacios } = await pool.query(
    'SELECT id, nombre, bloque, planta, tipo, es_accesible FROM espacios ORDER BY id ASC;'
  );

  const { rows: conexiones } = await pool.query(
    'SELECT id_espacio_origen, id_espacio_destino, tipo_conexion, es_accesible FROM conexiones;'
  );

  const { rows: incidenciasActivas } = await pool.query(
    'SELECT id_espacio, tipo, descripcion FROM incidencias WHERE estado = \'activa\';'
  );

  // 2. Comprobar API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'tu_api_key_de_gemini') {
    throw new Error('Debes configurar GEMINI_API_KEY en el archivo backend/.env para utilizar el motor de rutas con IA.');
  }

  // 3. Construir contexto del prompt
  const ai = new GoogleGenAI({ apiKey });

  const idsIncidencias = incidenciasActivas.map((i) => `${i.id_espacio} (${i.tipo}: ${i.descripcion || 'bloqueado'})`).join(', ');

  const promptSistema = `
Eres el motor de navegación accesible de un centro educativo para la aplicación "AccessiRoute".
Tu misión es interpretar la petición del usuario y devolver una RUTA VÁLIDA paso a paso utilizando EXCLUSIVAMENTE los nodos y conexiones del instituto suministrados abajo.

REGLAS ESTRICTAS DE NAVEGACIÓN:
1. SOLO puedes utilizar los identificadores de espacio (IDs) que existen en la lista de ESPACIOS. NUNCA inventes nombres ni códigos.
2. Cada paso contiguo en la "ruta" DEBE tener una conexión real registrada en la lista de CONEXIONES.
3. Si el usuario indica movilidad reducida, silla de ruedas, cochecito o "sin escaleras" (o soloAccesible = true):
   - ESTÁ TOTALMENTE PROHIBIDO utilizar conexiones con "es_accesible: false" (como escaleras).
   - DEBES utilizar el ascensor o rampas para subir o bajar de planta.
4. INCIDENCIAS ACTIVAS BLOQUEADAS:
   - Los siguientes espacios tienen incidencias y NO PUEDEN transitarse: [${idsIncidencias || 'Ninguna incidencia activa'}].
   - Si un ascensor tiene una incidencia, busca una ruta alternativa o infórmalo si el destino es inalcanzable.
5. Si idOrigen o idDestino vienen fijados, respétalos. Si no, dedúcelos del texto del usuario.

DATOS DEL CENTRO EDUCATIVO:
- ESPACIOS DISPONIBLES:
${JSON.stringify(espacios.map((e) => ({ id: e.id, nombre: e.nombre, bloque: e.bloque, planta: e.planta, tipo: e.tipo })))}

- CONEXIONES PERMITIDAS:
${JSON.stringify(conexiones)}

PETICIÓN DEL USUARIO:
"${peticionUsuario}"
${idOrigenForzado ? `Origen fijado: ${idOrigenForzado}` : ''}
${idDestinoForzado ? `Destino fijado: ${idDestinoForzado}` : ''}
${soloAccesible ? 'Requisito: Movilidad reducida estricta (solo rutas accesibles).' : ''}
`;

  const respuesta = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: promptSistema,
    config: {
      responseMimeType: 'application/json',
      responseSchema: esquemaRespuestaRuta,
      temperature: 0.1 // Baja temperatura para garantizar fidelidad al grafo sin inventar
    }
  });

  return JSON.parse(respuesta.text);
}
