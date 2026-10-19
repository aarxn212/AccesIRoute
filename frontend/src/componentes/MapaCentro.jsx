import { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, CircleMarker, Polyline, useMap, useMapEvents } from 'react-leaflet';
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

// Detector táctil para colocar la chincheta en modo reporte
function DetectorDeToques({ modoReporte, onCoordenadasSeleccionadas }) {
  useMapEvents({
    click(e) {
      if (modoReporte) {
        onCoordenadasSeleccionadas({
          coord_y: Math.round(e.latlng.lat),
          coord_x: Math.round(e.latlng.lng)
        });
      }
    }
  });
  return null;
}

const iconoChinchetaReporte = L.divIcon({
  className: 'chincheta-temporal',
  html: `
    <div style="
      background-color: #ef4444;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 25px rgba(239, 68, 68, 1);
      border: 3px solid #ffffff;
    ">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22]
});

const iconoMarcadorIncidencia = L.divIcon({
  className: 'icono-marcador-incidencia',
  html: `
    <div style="
      background-color: #ef4444;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 14px rgba(239, 68, 68, 0.9);
      border: 2px solid #ffffff;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

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

export default function MapaCentro({
  onSeleccionarEspacio,
  rutaActiva = [],
  onCargarEspacios,
  modoReporte = false,
  tipoIncidenciaAReportar = null,
  onConfirmarReporte,
  onCancelarReporte,
  actualizadorIncidencias = 0
}) {
  const [espacios, setEspacios] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState(1); // 1 = Baja, 2 = Alta
  const [cargando, setCargando] = useState(true);
  const [puntoReporte, setPuntoReporte] = useState(null); // { coord_x, coord_y }

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
  }, [onCargarEspacios, actualizadorIncidencias]);

  // Limpiar punto al salir del modo reporte
  useEffect(() => {
    if (!modoReporte) {
      setPuntoReporte(null);
    }
  }, [modoReporte]);

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

  // Espacio más cercano a la chincheta pulsada
  const espacioCercano = puntoReporte
    ? espaciosFiltrados.reduce((masCercano, esp) => {
        const dist = Math.hypot(esp.coord_x - puntoReporte.coord_x, esp.coord_y - puntoReporte.coord_y);
        if (!masCercano || dist < masCercano.dist) {
          return { espacio: esp, dist };
        }
        return masCercano;
      }, null)
    : null;

  // Coordenadas consecutivas para dibujar el camino en la planta activa
  const coordenadasRutaEnPlanta = rutaActiva
    .map((id) => espacios.find((e) => e.id === id))
    .filter((e) => e && e.planta === plantaSeleccionada && e.coord_x !== null && e.coord_y !== null)
    .map((e) => [e.coord_y, e.coord_x]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Banner superior informativo si estamos en modo reporte */}
      {modoReporte && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: '#dc2626',
          color: '#ffffff',
          padding: '10px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          fontWeight: 700,
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '2px solid #ffffff'
        }}>
          <span style={{ letterSpacing: '0.05em' }}>MODO REPORTE:</span>
          <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
            Toca el plano para situar: <strong>{tipoIncidenciaAReportar?.replace('_', ' ') || 'incidencia'}</strong>
          </span>
        </div>
      )}

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

          {/* Detector de toques para colocar la chincheta */}
          <DetectorDeToques
            modoReporte={modoReporte}
            onCoordenadasSeleccionadas={(c) => setPuntoReporte(c)}
          />

          {/* Chincheta temporal en modo reporte */}
          {modoReporte && puntoReporte && (
            <Marker
              position={[puntoReporte.coord_y, puntoReporte.coord_x]}
              icon={iconoChinchetaReporte}
            />
          )}

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

          {/* Marcadores de incidencias activas en esta planta */}
          {incidencias
            .filter((inc) => inc.planta === plantaSeleccionada && inc.coord_x !== null && inc.coord_y !== null)
            .map((inc) => (
              <Marker
                key={`incidencia-marcador-${inc.id}`}
                position={[inc.coord_y, inc.coord_x]}
                icon={iconoMarcadorIncidencia}
              >
                <Popup>
                  <div style={{ color: '#0f172a', padding: '4px', minWidth: '180px' }}>
                    <div style={{
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}>
                      Incidencia Activa
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', textTransform: 'capitalize' }}>
                      {inc.tipo.replace('_', ' ')}
                    </h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#475569' }}>
                      <strong>Ubicación:</strong> {inc.nombre_espacio} (Planta {inc.planta})
                    </p>
                    {inc.descripcion && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', fontStyle: 'italic', color: '#334155' }}>
                        "{inc.descripcion}"
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

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
                      {espacio.es_accesible ? 'Espacio Accesible' : 'Sin acceso adaptado'}
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
                        Incidencia activa reportada
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

      {/* Barra inferior de confirmación en modo reporte táctil */}
      {modoReporte && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '2px solid var(--color-peligro)',
          borderRadius: 'var(--radio-borde)',
          padding: '16px 24px',
          boxShadow: 'var(--sombra-panel)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '92%',
          minWidth: '340px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--color-peligro)', fontSize: '1.05rem' }}>
              {puntoReporte
                ? `Ubicación fijada en (${puntoReporte.coord_x}, ${puntoReporte.coord_y})`
                : 'Toca la pantalla táctil en el punto exacto'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--texto-secundario)', marginTop: '4px' }}>
              {puntoReporte && espacioCercano
                ? `Espacio más cercano: ${espacioCercano.espacio.nombre} (Planta ${plantaSeleccionada})`
                : 'Pulsa con el dedo en la zona donde está la barrera o avería'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              disabled={!puntoReporte}
              onClick={() => {
                if (puntoReporte && onConfirmarReporte) {
                  onConfirmarReporte({
                    tipo: tipoIncidenciaAReportar,
                    coord_x: puntoReporte.coord_x,
                    coord_y: puntoReporte.coord_y,
                    id_espacio: espacioCercano?.espacio?.id || espaciosFiltrados[0]?.id
                  });
                  setPuntoReporte(null);
                }
              }}
              className="boton-tactil"
              style={{
                backgroundColor: puntoReporte ? 'var(--color-peligro)' : '#475569',
                color: '#ffffff',
                fontWeight: 700,
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: puntoReporte ? 'pointer' : 'not-allowed',
                border: 'none',
                fontSize: '1rem'
              }}
            >
              Confirmar Incidencia
            </button>

            <button
              type="button"
              onClick={() => {
                setPuntoReporte(null);
                if (onCancelarReporte) onCancelarReporte();
              }}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--borde-suave)',
                color: 'var(--texto-atenuado)',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
