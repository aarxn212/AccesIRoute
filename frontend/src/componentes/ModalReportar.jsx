export default function ModalReportar({ abierto, onCerrar, onSeleccionarTipo }) {
  if (!abierto) return null;

  const TIPOS_INCIDENCIA = [
    { id: 'obstaculo', nombre: 'Obstáculo', color: '#ea580c' },
    { id: 'ascensor', nombre: 'Ascensor', color: '#8b5cf6' },
    { id: 'puerta', nombre: 'Puerta', color: '#10b981' },
    { id: 'rampa', nombre: 'Rampa', color: '#0284c7' },
    { id: 'paso_bloqueado', nombre: 'Paso Bloqueado', color: '#ef4444' },
    { id: 'otro', nombre: 'Otro', color: '#f59e0b' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-reportar"
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
          border: '2px solid var(--color-peligro)',
          borderRadius: 'var(--radio-borde)',
          width: '100%',
          maxWidth: '520px',
          boxShadow: 'var(--sombra-panel)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 id="titulo-modal-reportar" style={{ fontSize: '1.4rem', margin: 0, color: 'var(--texto-principal)' }}>
              Reportar Incidencia
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
              Selecciona el tipo y luego coloca el marcador con el dedo en el plano
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar ventana de reporte"
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

        {/* Cuadrícula táctil rápida con los 6 tipos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {TIPOS_INCIDENCIA.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSeleccionarTipo(t.id)}
              className="boton-tactil"
              style={{
                minHeight: '64px',
                padding: '14px 18px',
                backgroundColor: 'var(--fondo-elevado)',
                border: `2px solid ${t.color}`,
                color: 'var(--texto-principal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '14px',
                fontSize: '1.1rem',
                borderRadius: '12px'
              }}
            >
              <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: t.color,
                display: 'inline-block',
                boxShadow: `0 0 8px ${t.color}`
              }} aria-hidden="true" />
              <span style={{ fontWeight: 700 }}>{t.nombre}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onCerrar}
          style={{
            minHeight: '44px',
            backgroundColor: 'transparent',
            border: '1px solid var(--borde-suave)',
            color: 'var(--texto-atenuado)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
