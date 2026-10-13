import { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dimensiones del plano arquitectónico virtual (0 a 1000)
const DIMENSION_PLANO = 1000;
const LIMITES_PLANO = [
  [0, 0],
  [DIMENSION_PLANO, DIMENSION_PLANO]
];

// Helper para recentrar el mapa cuando cambia la planta
function ControladorPlano({ planta }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [planta, map]);
  return null;
}

// Icono personalizado táctil accesible mediante SVG
const crearIconoEspacio = (espacio, tieneIncidencia) => {
  let colorFondo = '#3b82f6'; // Azul por defecto
  let iconoTexto = '📚';     // Por defecto aula: libros

  const id = espacio.id || '';
  const tipo = espacio.tipo || '';

  if (id.includes('ACTOS') || tipo === 'actos') {
    colorFondo = '#ec4899'; // Rosa para sala de actos
    iconoTexto = '🎭';
  } else if (id.includes('PATIO') || tipo === 'patio') {
    colorFondo = '#15803d'; // Verde oscuro para patio exterior
    iconoTexto = '🌳';
  } else if (tipo === 'entrada') {
    colorFondo = '#10b981'; // Verde para puertas y accesos
    iconoTexto = '🚪';
  } else if (tipo === 'aula') {
    colorFondo = '#2563eb'; // Azul intenso para aulas de clase
    iconoTexto = '📚';
  } else if (tipo === 'ascensor') {
    colorFondo = '#8b5cf6'; // Violeta para ascensor
    iconoTexto = '🛗';
  } else if (tipo === 'escalera') {
    colorFondo = '#64748b'; // Pizarra para escaleras
    iconoTexto = '🪜';
  } else if (tipo === 'direccion') {
    colorFondo = '#0284c7'; // Azul institucional
    iconoTexto = '🏛️';
  } else if (tipo === 'gimnasio') {
    colorFondo = '#f59e0b'; // Ámbar para deporte
    iconoTexto = '🏀';
  } else if (id.includes('BANO-H')) {
    colorFondo = '#0284c7'; // Azul cian para baño hombres
    iconoTexto = '🚹';
  } else if (id.includes('BANO-M')) {
    colorFondo = '#db2777'; // Rosa fucsia para baño mujeres
    iconoTexto = '🚺';
  } else if (tipo === 'bano') {
    colorFondo = '#06b6d4'; // Cian para aseos neutros/generales
    iconoTexto = '🚻';
  } else if (tipo === 'pasillo') {
    colorFondo = '#475569'; // Gris para pasillos
    iconoTexto = '🚶';
  }

  // Si tiene una incidencia activa, destacar en rojo de alerta
  if (tieneIncidencia) {
    colorFondo = '#ef4444';
    iconoTexto = '🚨';
  }

  return L.divIcon({
    className: 'icono-marcador-contenedor',
    html: `
      <div style="
        background-color: ${colorFondo};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
      ">
        ${iconoTexto}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

export default function MapaCentro({ onSeleccionarEspacio, rutaActiva = [], onCargarEspacios }) {
  const [espacios, setEspacios] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState(1); // 1 = Baja, 2 = Alta
  const [cargando, setCargando] = useState(true);

  // Cargar espacios e incidencias desde la API REST
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/api/espacios').then((r) => r.json()),
      fetch('http://localhost:3001/api/incidencias').then((r) => r.json())
    ])
      .then(([datosEspacios, datosIncidencias]) => {
        setEspacios(datosEspacios);
        if (onCargarEspacios) onCargarEspacios(datosEspacios);
        setIncidencias(datosIncidencias);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar datos del mapa:', err);
        setCargando(false);
      });
  }, [onCargarEspacios]);

  // Si se calcula una nueva ruta, sintonizar la planta del punto de inicio
  useEffect(() => {
    if (rutaActiva && rutaActiva.length > 0 && espacios.length > 0) {
      const primerEspacio = espacios.find((e) => e.id === rutaActiva[0]);
      if (primerEspacio && primerEspacio.planta) {
        setPlantaSeleccionada(primerEspacio.planta);
      }
    }
  }, [rutaActiva, espacios]);

  // Filtrar espacios según la planta activa en el selector
  const espaciosFiltrados = espacios.filter(
    (e) => e.planta === plantaSeleccionada && e.coord_x !== null && e.coord_y !== null
  );

  // Coordenadas consecutivas para dibujar el camino en la planta activa
  const coordenadasRutaEnPlanta = rutaActiva
    .map((id) => espacios.find((e) => e.id === id))
    .filter((e) => e && e.planta === plantaSeleccionada && e.coord_x !== null && e.coord_y !== null)
    .map((e) => [e.coord_y, e.coord_x]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Selector táctil de plantas flotante */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '8px',
        borderRadius: '16px',
        border: '1px solid var(--borde-suave)'
      }}>
        <button
          type="button"
          onClick={() => setPlantaSeleccionada(1)}
          className={`boton-tactil ${plantaSeleccionada === 1 ? 'boton-primario' : ''}`}
          style={{
            minHeight: '44px',
            padding: '8px 16px',
            fontSize: '1rem',
            backgroundColor: plantaSeleccionada === 1 ? 'var(--color-primario)' : 'transparent',
            color: '#ffffff'
          }}
        >
          Planta 1 (Baja)
        </button>

        <button
          type="button"
          onClick={() => setPlantaSeleccionada(2)}
          className={`boton-tactil ${plantaSeleccionada === 2 ? 'boton-primario' : ''}`}
          style={{
            minHeight: '44px',
            padding: '8px 16px',
            fontSize: '1rem',
            backgroundColor: plantaSeleccionada === 2 ? 'var(--color-primario)' : 'transparent',
            color: '#ffffff'
          }}
        >
          Planta 2 (Alta)
        </button>
      </div>

      {cargando ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--texto-secundario)' }}>
          Cargando plano del centro educativo...
        </div>
      ) : (
        <MapContainer
          crs={L.CRS.Simple}
          bounds={LIMITES_PLANO}
          maxBounds={LIMITES_PLANO}
          maxBoundsViscosity={1.0}
          center={[500, 500]}
          zoom={0}
          minZoom={-1}
          maxZoom={2}
          style={{ height: '100%', width: '100%', backgroundColor: '#090d16' }}
        >
          <ControladorPlano planta={plantaSeleccionada} />

          {/* Rejilla de referencia y contornos de los 4 bloques */}
          <CircleMarker center={[500, 500]} radius={8} pathOptions={{ color: '#3b82f6', fillOpacity: 0.2 }} />

          {/* Trazado de ruta generado por la IA en la planta activa */}
          {coordenadasRutaEnPlanta.length > 1 && (
            <Polyline
              positions={coordenadasRutaEnPlanta}
              pathOptions={{
                color: '#38bdf8',
                weight: 8,
                opacity: 0.95,
                dashArray: '8, 12'
              }}
            />
          )}

          {/* Marcadores de los espacios en la planta activa */}
          {espaciosFiltrados.map((espacio) => {
            // Comprobar si este espacio tiene incidencias activas
            const tieneIncidencia = incidencias.some((inc) => inc.id_espacio === espacio.id);

            // En L.CRS.Simple, la posición se expresa en [Y, X]
            const posicion = [espacio.coord_y, espacio.coord_x];

            return (
              <Marker
                key={espacio.id}
                position={posicion}
                icon={crearIconoEspacio(espacio, tieneIncidencia)}
              >
                <Popup>
                  <div style={{ color: '#0f172a', padding: '4px', minWidth: '180px' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>{espacio.nombre}</h3>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#475569' }}>
                      <strong>Bloque:</strong> {espacio.bloque} | <strong>Planta:</strong> {espacio.planta}
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem' }}>
                      {espacio.es_accesible ? '♿ Espacio Accesible' : '⚠️ Sin acceso adaptado'}
                    </p>

                    {tieneIncidencia && (
                      <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}>
                        🚨 Incidencia activa reportada
                      </div>
                    )}

                    {onSeleccionarEspacio && (
                      <button
                        type="button"
                        onClick={() => onSeleccionarEspacio(espacio)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Seleccionar espacio
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
