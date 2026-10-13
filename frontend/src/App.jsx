import { useState, useEffect } from 'react';
import MapaCentro from './componentes/MapaCentro';
import ModalRuta from './componentes/ModalRuta';

function App() {
  const [conexionApi, setConexionApi] = useState('Verificando...');
  const [espacios, setEspacios] = useState([]);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [modalRutaAbierto, setModalRutaAbierto] = useState(false);
  const [resultadoRuta, setResultadoRuta] = useState(null);

  useEffect(() => {
    // Comprobar la conexión con el backend
    fetch('http://localhost:3001/api/health')
      .then((res) => res.json())
      .then((data) => setConexionApi(`Conectado (${data.project})`))
      .catch(() => setConexionApi('Backend desconectado'));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Barra superior del quiosco táctil */}
      <header className="barra-superior" role="banner">
        <div className="marca-app">
          <span aria-hidden="true">♿</span>
          <span>AccessiRoute</span>
          <span className="marca-badge">Panel Táctil</span>
        </div>

        {/* Botones de acción rápida con ergonomía táctil */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setModalRutaAbierto(true)}
            className="boton-tactil boton-primario"
            aria-label="Buscar ruta asistida por IA"
          >
            <span aria-hidden="true">🗺️</span>
            <span>Rutas</span>
          </button>

          <button
            type="button"
            className="boton-tactil boton-reportar"
            aria-label="Reportar incidencia rápida"
          >
            <span aria-hidden="true">🚨</span>
            <span>Reportar</span>
          </button>
        </div>
      </header>

      {/* Contenedor principal: Mapa interactivo a pantalla completa */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapaCentro
          onSeleccionarEspacio={(espacio) => setEspacioSeleccionado(espacio)}
          rutaActiva={resultadoRuta?.ruta || []}
          onCargarEspacios={(lista) => setEspacios(lista)}
        />

        {/* Panel inferior con la explicación de la ruta calculada por la IA */}
        {resultadoRuta && (
          <aside
            aria-label="Ruta propuesta por la IA"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 1000,
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '2px solid var(--color-primario)',
              borderRadius: 'var(--radio-borde)',
              padding: '16px 20px',
              boxShadow: 'var(--sombra-panel)',
              maxWidth: '440px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-primario)', fontSize: '0.95rem' }}>
                🤖 RUTA ASISTIDA POR GEMINI
              </span>
              <button
                type="button"
                onClick={() => setResultadoRuta(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--texto-atenuado)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                ✕ Limpiar
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--texto-principal)', lineHeight: 1.4 }}>
              {resultadoRuta.motivo}
            </p>

            {resultadoRuta.barreras_evitadas && resultadoRuta.barreras_evitadas.length > 0 && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--color-peligro)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.85rem',
                color: '#fca5a5'
              }}>
                ⚠️ <strong>Se evitaron barreras:</strong> {resultadoRuta.barreras_evitadas.join(', ')}
              </div>
            )}

            {resultadoRuta.ruta && resultadoRuta.ruta.length > 0 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--texto-atenuado)' }}>
                <strong>Itinerario:</strong> {resultadoRuta.ruta.join(' ➔ ')}
              </div>
            )}
          </aside>
        )}

        {/* Tarjeta inferior informativa cuando se pulsa un aula o espacio */}
        {espacioSeleccionado && !resultadoRuta && (
          <aside
            aria-label="Información del espacio seleccionado"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              backgroundColor: 'var(--fondo-superficie)',
              border: '2px solid var(--color-primario)',
              borderRadius: 'var(--radio-borde)',
              padding: '16px 24px',
              boxShadow: 'var(--sombra-panel)',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              maxWidth: '90%',
              minWidth: '320px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--texto-principal)' }}>
                {espacioSeleccionado.nombre}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
                Bloque {espacioSeleccionado.bloque} • Planta {espacioSeleccionado.planta} • {espacioSeleccionado.tipo}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button
                type="button"
                onClick={() => setEspacioSeleccionado(null)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--texto-atenuado)',
                  border: '1px solid var(--borde-suave)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </aside>
        )}
      </main>

      {/* Modal táctil de búsqueda de rutas */}
      <ModalRuta
        abierto={modalRutaAbierto}
        onCerrar={() => setModalRutaAbierto(false)}
        espacios={espacios}
        onRutaCalculada={(ruta) => setResultadoRuta(ruta)}
      />
    </div>
  );
}

export default App;
