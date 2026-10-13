import { useState, useEffect } from 'react';
import MapaCentro from './componentes/MapaCentro';

function App() {
  const [conexionApi, setConexionApi] = useState('Verificando...');
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

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
          <button type="button" className="boton-tactil boton-primario" aria-label="Buscar ruta accesible">
            <span aria-hidden="true">🗺️</span>
            <span>Rutas</span>
          </button>

          <button type="button" className="boton-tactil boton-reportar" aria-label="Reportar incidencia rápida">
            <span aria-hidden="true">🚨</span>
            <span>Reportar</span>
          </button>
        </div>
      </header>

      {/* Contenedor principal: Mapa interactivo a pantalla completa */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapaCentro onSeleccionarEspacio={(espacio) => setEspacioSeleccionado(espacio)} />

        {/* Tarjeta inferior informativa cuando se pulsa un aula o espacio */}
        {espacioSeleccionado && (
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
    </div>
  );
}

export default App;
