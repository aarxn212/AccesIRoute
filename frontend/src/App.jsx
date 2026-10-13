import { useState, useEffect } from 'react';

function App() {
  const [conexionApi, setConexionApi] = useState('Verificando...');

  useEffect(() => {
    // Comprobar la conexión con el backend
    fetch('http://localhost:3001/api/health')
      .then((res) => res.json())
      .then((data) => setConexionApi(`Conectado (${data.project})`))
      .catch(() => setConexionApi('Backend desconectado'));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Barra superior de quiosco táctil */}
      <header className="barra-superior" role="banner">
        <div className="marca-app">
          <span aria-hidden="true">♿</span>
          <span>AccessiRoute</span>
          <span className="marca-badge">Panel Táctil</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--texto-atenuado)' }}>
            Estado API: <strong style={{ color: conexionApi.includes('Conectado') ? 'var(--color-accesible)' : 'var(--color-alerta)' }}>{conexionApi}</strong>
          </span>
        </div>
      </header>

      {/* Área principal del panel */}
      <main style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section style={{
          flex: 1,
          backgroundColor: 'var(--fondo-superficie)',
          borderRadius: 'var(--radio-borde)',
          border: '1px solid var(--borde-suave)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Terminal de Orientación Escolar</h1>
          <p style={{ maxWidth: '600px', color: 'var(--texto-secundario)', marginBottom: '32px' }}>
            Bienvenido al panel interactivo de AccessiRoute. Aquí se mostrará el plano interactivo de los 4 bloques del centro con rutas adaptadas e incidencias en tiempo real.
          </p>

          {/* Botones de acción rápida con ergonomía táctil */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="boton-tactil boton-primario" aria-label="Consultar rutas">
              <span aria-hidden="true">🗺️</span>
              <span>Buscar Ruta</span>
            </button>

            <button type="button" className="boton-tactil boton-reportar" aria-label="Reportar una incidencia">
              <span aria-hidden="true">🚨</span>
              <span>Reportar Incidencia</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
