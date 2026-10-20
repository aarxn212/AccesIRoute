import { useState } from 'react';

export default function ModalRuta({ abierto, onCerrar, espacios = [], onRutaCalculada }) {
  const [peticionTexto, setPeticionTexto] = useState('');
  const [idOrigen, setIdOrigen] = useState('');
  const [idDestino, setIdDestino] = useState('');
  const [soloAccesible, setSoloAccesible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  if (!abierto) return null;

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const respuesta = await fetch('http://localhost:3001/api/rutas/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peticionUsuario: peticionTexto,
          idOrigen: idOrigen || null,
          idDestino: idDestino || null,
          soloAccesible
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'Error al calcular la ruta');
      }

      onRutaCalculada(datos);
      onCerrar();
    } catch (error) {
      console.error('Error al consultar ruta:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-ruta"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--fondo-superficie)',
          border: '2px solid var(--borde-suave)',
          borderRadius: 'var(--radio-borde)',
          width: '100%',
          maxWidth: '560px',
          boxShadow: 'var(--sombra-panel)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="titulo-modal-ruta" style={{ fontSize: '1.5rem', margin: 0, color: 'var(--texto-principal)' }}>
            Buscar Ruta con IA
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar ventana de rutas"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--texto-atenuado)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            Cerrar
          </button>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid var(--color-peligro)',
              color: '#fca5a5',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="peticion-ia" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              ¿A dónde quieres ir? (Escribe de forma natural):
            </label>
            <input
              id="peticion-ia"
              type="text"
              placeholder="Ej: Estoy en recepción y quiero ir al aula A-04 sin escaleras"
              value={peticionTexto}
              onChange={(evento) => setPeticionTexto(evento.target.value)}
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--borde-suave)',
                backgroundColor: 'var(--fondo-principal)',
                color: 'var(--texto-principal)',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label htmlFor="select-origen" style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
                Origen (opcional):
              </label>
              <select
                id="select-origen"
                value={idOrigen}
                onChange={(evento) => setIdOrigen(evento.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--fondo-principal)',
                  color: 'var(--texto-principal)',
                  border: '1px solid var(--borde-suave)'
                }}
              >
                <option value="">Dedúzcalo la IA</option>
                {espacios.map((esp) => (
                  <option key={`orig-${esp.id}`} value={esp.id}>
                    {esp.nombre} ({esp.bloque} - P{esp.planta})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-destino" style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
                Destino (opcional):
              </label>
              <select
                id="select-destino"
                value={idDestino}
                onChange={(evento) => setIdDestino(evento.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--fondo-principal)',
                  color: 'var(--texto-principal)',
                  border: '1px solid var(--borde-suave)'
                }}
              >
                <option value="">Dedúzcalo la IA</option>
                {espacios.map((esp) => (
                  <option key={`dest-${esp.id}`} value={esp.id}>
                    {esp.nombre} ({esp.bloque} - P{esp.planta})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'var(--fondo-elevado)',
              borderRadius: '8px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input
              type="checkbox"
              checked={soloAccesible}
              onChange={(evento) => setSoloAccesible(evento.target.checked)}
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>
              Ruta accesible (Silla de ruedas / Sin escaleras)
            </span>
          </label>

          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onCerrar}
              disabled={cargando}
              style={{
                flex: 1,
                minHeight: '48px',
                backgroundColor: 'transparent',
                border: '1px solid var(--borde-suave)',
                color: 'var(--texto-secundario)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className="boton-primario"
              style={{
                flex: 2,
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {cargando ? (
                <span>Consultando a la IA...</span>
              ) : (
                <span>Calcular Ruta</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
