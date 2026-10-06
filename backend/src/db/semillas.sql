-- =====================================================
-- DATOS REALES DEL INSTITUTO (SEMILLAS) - ACCESSIROUTE
-- =====================================================

-- 1. INSERTAR ESPACIOS
INSERT INTO espacios (id, nombre, bloque, planta, tipo, es_accesible, coord_x, coord_y) VALUES
-- =====================================================
-- BLOQUE A - PLANTA 1 (Baja)
-- =====================================================
('A-P1-ENTRADA', 'Entrada Principal Bloque A', 'A', 1, 'entrada', true, 500, 300),
('A-P1-SECRETARIA', 'Secretaría Bloque A', 'A', 1, 'direccion', true, 420, 320),
('A-P1-ACTOS', 'Sala de Actos', 'A', 1, 'aula', true, 580, 320),
('A-P1-PASILLO-IZQ', 'Pasillo Izquierda (Planta 1)', 'A', 1, 'pasillo', true, 350, 250),
('A-P1-AULA-01', 'Aula A-01', 'A', 1, 'aula', true, 300, 220),
('A-P1-AULA-02', 'Aula A-02', 'A', 1, 'aula', true, 260, 220),
('A-P1-AULA-03', 'Aula A-03', 'A', 1, 'aula', true, 220, 220),
('A-P1-AULA-04', 'Aula A-04', 'A', 1, 'aula', true, 180, 220),
('A-P1-AULA-05', 'Aula A-05', 'A', 1, 'aula', true, 140, 220),
('A-P1-PASILLO-DER', 'Pasillo Derecha al Fondo (Planta 1)', 'A', 1, 'pasillo', true, 650, 250),
('A-P1-AULA-06', 'Aula A-06', 'A', 1, 'aula', true, 700, 220),
('A-P1-AULA-07', 'Aula A-07', 'A', 1, 'aula', true, 740, 220),
('A-P1-AULA-08', 'Aula A-08', 'A', 1, 'aula', true, 780, 220),
('A-P1-AULA-09', 'Aula A-09', 'A', 1, 'aula', true, 820, 220),
('A-P1-AULA-10', 'Aula A-10', 'A', 1, 'aula', true, 860, 220),
('A-P1-ESCALERA', 'Escalera Bloque A (Planta 1)', 'A', 1, 'escalera', false, 500, 220),
('A-P1-ASCENSOR', 'Ascensor Bloque A (Planta 1)', 'A', 1, 'ascensor', true, 540, 220),

-- =====================================================
-- BLOQUE A - PLANTA 2 (Alta)
-- =====================================================
('A-P2-HALL', 'Distribuidor Central Bloque A (Planta 2)', 'A', 2, 'pasillo', true, 500, 220),
('A-P2-ESCALERA', 'Escalera Bloque A (Planta 2)', 'A', 2, 'escalera', false, 500, 220),
('A-P2-ASCENSOR', 'Ascensor Bloque A (Planta 2)', 'A', 2, 'ascensor', true, 540, 220),
('A-P2-PASILLO-IZQ', 'Pasillo Izquierda (Planta 2)', 'A', 2, 'pasillo', true, 350, 220),
('A-P2-AULA-11', 'Aula A-11', 'A', 2, 'aula', true, 300, 180),
('A-P2-AULA-12', 'Aula A-12', 'A', 2, 'aula', true, 260, 180),
('A-P2-AULA-13', 'Aula A-13', 'A', 2, 'aula', true, 220, 180),
('A-P2-AULA-14', 'Aula A-14', 'A', 2, 'aula', true, 180, 180),
('A-P2-AULA-15', 'Aula A-15', 'A', 2, 'aula', true, 140, 180),
('A-P2-PASILLO-DER', 'Pasillo Derecha (Planta 2)', 'A', 2, 'pasillo', true, 650, 220),
('A-P2-AULA-16', 'Aula A-16', 'A', 2, 'aula', true, 700, 180),
('A-P2-AULA-17', 'Aula A-17', 'A', 2, 'aula', true, 740, 180),
('A-P2-AULA-18', 'Aula A-18', 'A', 2, 'aula', true, 780, 180),
('A-P2-AULA-19', 'Aula A-19', 'A', 2, 'aula', true, 820, 180),
('A-P2-AULA-20', 'Aula A-20', 'A', 2, 'aula', true, 860, 180),

-- =====================================================
-- BLOQUE B - PLANTA 1 Y 2
-- =====================================================
('B-P1-ENTRADA', 'Entrada Bloque B', 'B', 1, 'entrada', true, 500, 600),
('B-P1-PASILLO', 'Pasillo Bloque B (Planta 1)', 'B', 1, 'pasillo', true, 500, 650),
('B-P1-AULA-01', 'Aula B-01', 'B', 1, 'aula', true, 420, 680),
('B-P1-AULA-02', 'Aula B-02', 'B', 1, 'aula', true, 460, 680),
('B-P1-AULA-03', 'Aula B-03', 'B', 1, 'aula', true, 540, 680),
('B-P1-AULA-04', 'Aula B-04', 'B', 1, 'aula', true, 580, 680),
('B-P1-BANO', 'Baño Bloque B (Planta 1)', 'B', 1, 'bano', true, 500, 700),
('B-P1-ESCALERA', 'Escalera Bloque B (Planta 1)', 'B', 1, 'escalera', false, 380, 650),
('B-P1-ASCENSOR', 'Ascensor Bloque B (Planta 1)', 'B', 1, 'ascensor', true, 620, 650),

('B-P2-PASILLO', 'Pasillo Bloque B (Planta 2)', 'B', 2, 'pasillo', true, 500, 650),
('B-P2-ESCALERA', 'Escalera Bloque B (Planta 2)', 'B', 2, 'escalera', false, 380, 650),
('B-P2-ASCENSOR', 'Ascensor Bloque B (Planta 2)', 'B', 2, 'ascensor', true, 620, 650),
('B-P2-AULA-05', 'Aula B-05', 'B', 2, 'aula', true, 380, 680),
('B-P2-AULA-06', 'Aula B-06', 'B', 2, 'aula', true, 430, 680),
('B-P2-AULA-07', 'Aula B-07', 'B', 2, 'aula', true, 480, 680),
('B-P2-AULA-08', 'Aula B-08', 'B', 2, 'aula', true, 530, 680),
('B-P2-AULA-09', 'Aula B-09', 'B', 2, 'aula', true, 580, 680),
('B-P2-AULA-10', 'Aula B-10', 'B', 2, 'aula', true, 630, 680),

-- =====================================================
-- BLOQUE C - DIRECCIÓN / SECRETARÍA (PLANTA ÚNICA)
-- =====================================================
('C-P1-ENTRADA', 'Entrada Bloque C (Dirección)', 'C', 1, 'entrada', true, 200, 500),
('C-P1-DIRECCION', 'Despacho de Dirección', 'C', 1, 'direccion', true, 180, 550),
('C-P1-SECRETARIA', 'Secretaría General', 'C', 1, 'direccion', true, 220, 550),

-- =====================================================
-- BLOQUE D - GIMNASIO (PLANTA ÚNICA)
-- =====================================================
('D-P1-ENTRADA', 'Entrada Gimnasio', 'D', 1, 'entrada', true, 800, 500),
('D-P1-GIMNASIO', 'Pabellón Deportivo / Gimnasio', 'D', 1, 'gimnasio', true, 850, 550),

-- =====================================================
-- ZONA EXTERIOR - PATIO CENTRAL (Conecta los 4 bloques)
-- =====================================================
('EXT-PATIO', 'Patio Central del Instituto', 'A', 1, 'pasillo', true, 500, 450)
ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 2. INSERTAR CONEXIONES (GRAFO DE RUTAS)
-- =====================================================

-- Conexiones exteriores entre Bloques a cota cero (Patio accesible)
INSERT INTO conexiones (id_espacio_origen, id_espacio_destino, tipo_conexion, es_accesible) VALUES
('EXT-PATIO', 'A-P1-ENTRADA', 'pasillo', true),
('A-P1-ENTRADA', 'EXT-PATIO', 'pasillo', true),
('EXT-PATIO', 'B-P1-ENTRADA', 'pasillo', true),
('B-P1-ENTRADA', 'EXT-PATIO', 'pasillo', true),
('EXT-PATIO', 'C-P1-ENTRADA', 'pasillo', true),
('C-P1-ENTRADA', 'EXT-PATIO', 'pasillo', true),
('EXT-PATIO', 'D-P1-ENTRADA', 'pasillo', true),
('D-P1-ENTRADA', 'EXT-PATIO', 'pasillo', true),

-- Bloque A - Planta 1 (Distribución en cruz)
('A-P1-ENTRADA', 'A-P1-SECRETARIA', 'puerta', true),
('A-P1-SECRETARIA', 'A-P1-ENTRADA', 'puerta', true),
('A-P1-ENTRADA', 'A-P1-ACTOS', 'puerta', true),
('A-P1-ACTOS', 'A-P1-ENTRADA', 'puerta', true),
('A-P1-ENTRADA', 'A-P1-ESCALERA', 'pasillo', true),
('A-P1-ESCALERA', 'A-P1-ENTRADA', 'pasillo', true),
('A-P1-ENTRADA', 'A-P1-ASCENSOR', 'pasillo', true),
('A-P1-ASCENSOR', 'A-P1-ENTRADA', 'pasillo', true),

-- Bloque A - Pasillo Izquierda PB (Aulas 1 a 5)
('A-P1-ENTRADA', 'A-P1-PASILLO-IZQ', 'pasillo', true),
('A-P1-PASILLO-IZQ', 'A-P1-ENTRADA', 'pasillo', true),
('A-P1-PASILLO-IZQ', 'A-P1-AULA-01', 'puerta', true),
('A-P1-AULA-01', 'A-P1-PASILLO-IZQ', 'puerta', true),
('A-P1-PASILLO-IZQ', 'A-P1-AULA-02', 'puerta', true),
('A-P1-AULA-02', 'A-P1-PASILLO-IZQ', 'puerta', true),
('A-P1-PASILLO-IZQ', 'A-P1-AULA-03', 'puerta', true),
('A-P1-AULA-03', 'A-P1-PASILLO-IZQ', 'puerta', true),
('A-P1-PASILLO-IZQ', 'A-P1-AULA-04', 'puerta', true),
('A-P1-AULA-04', 'A-P1-PASILLO-IZQ', 'puerta', true),
('A-P1-PASILLO-IZQ', 'A-P1-AULA-05', 'puerta', true),
('A-P1-AULA-05', 'A-P1-PASILLO-IZQ', 'puerta', true),

-- Bloque A - Pasillo Derecha PB (Aulas 6 a 10)
('A-P1-ENTRADA', 'A-P1-PASILLO-DER', 'pasillo', true),
('A-P1-PASILLO-DER', 'A-P1-ENTRADA', 'pasillo', true),
('A-P1-PASILLO-DER', 'A-P1-AULA-06', 'puerta', true),
('A-P1-AULA-06', 'A-P1-PASILLO-DER', 'puerta', true),
('A-P1-PASILLO-DER', 'A-P1-AULA-07', 'puerta', true),
('A-P1-AULA-07', 'A-P1-PASILLO-DER', 'puerta', true),
('A-P1-PASILLO-DER', 'A-P1-AULA-08', 'puerta', true),
('A-P1-AULA-08', 'A-P1-PASILLO-DER', 'puerta', true),
('A-P1-PASILLO-DER', 'A-P1-AULA-09', 'puerta', true),
('A-P1-AULA-09', 'A-P1-PASILLO-DER', 'puerta', true),
('A-P1-PASILLO-DER', 'A-P1-AULA-10', 'puerta', true),
('A-P1-AULA-10', 'A-P1-PASILLO-DER', 'puerta', true),

-- Bloque A - Conexiones Verticales (P1 <-> P2)
('A-P1-ESCALERA', 'A-P2-ESCALERA', 'escalera', false), -- ¡Barrera para silla de ruedas!
('A-P2-ESCALERA', 'A-P1-ESCALERA', 'escalera', false),
('A-P1-ASCENSOR', 'A-P2-ASCENSOR', 'ascensor', true),  -- ¡Accesible!
('A-P2-ASCENSOR', 'A-P1-ASCENSOR', 'ascensor', true),

-- Bloque A - Planta 2 (Distribuidor central con escaleras/ascensor)
('A-P2-ESCALERA', 'A-P2-HALL', 'pasillo', true),
('A-P2-HALL', 'A-P2-ESCALERA', 'pasillo', true),
('A-P2-ASCENSOR', 'A-P2-HALL', 'pasillo', true),
('A-P2-HALL', 'A-P2-ASCENSOR', 'pasillo', true),

-- Bloque A - Pasillo Izquierda P2 (Aulas 11 a 15)
('A-P2-HALL', 'A-P2-PASILLO-IZQ', 'pasillo', true),
('A-P2-PASILLO-IZQ', 'A-P2-HALL', 'pasillo', true),
('A-P2-PASILLO-IZQ', 'A-P2-AULA-11', 'puerta', true),
('A-P2-AULA-11', 'A-P2-PASILLO-IZQ', 'puerta', true),
('A-P2-PASILLO-IZQ', 'A-P2-AULA-12', 'puerta', true),
('A-P2-AULA-12', 'A-P2-PASILLO-IZQ', 'puerta', true),
('A-P2-PASILLO-IZQ', 'A-P2-AULA-13', 'puerta', true),
('A-P2-AULA-13', 'A-P2-PASILLO-IZQ', 'puerta', true),
('A-P2-PASILLO-IZQ', 'A-P2-AULA-14', 'puerta', true),
('A-P2-AULA-14', 'A-P2-PASILLO-IZQ', 'puerta', true),
('A-P2-PASILLO-IZQ', 'A-P2-AULA-15', 'puerta', true),
('A-P2-AULA-15', 'A-P2-PASILLO-IZQ', 'puerta', true),

-- Bloque A - Pasillo Derecha P2 (Aulas 16 a 20)
('A-P2-HALL', 'A-P2-PASILLO-DER', 'pasillo', true),
('A-P2-PASILLO-DER', 'A-P2-HALL', 'pasillo', true),
('A-P2-PASILLO-DER', 'A-P2-AULA-16', 'puerta', true),
('A-P2-AULA-16', 'A-P2-PASILLO-DER', 'puerta', true),
('A-P2-PASILLO-DER', 'A-P2-AULA-17', 'puerta', true),
('A-P2-AULA-17', 'A-P2-PASILLO-DER', 'puerta', true),
('A-P2-PASILLO-DER', 'A-P2-AULA-18', 'puerta', true),
('A-P2-AULA-18', 'A-P2-PASILLO-DER', 'puerta', true),
('A-P2-PASILLO-DER', 'A-P2-AULA-19', 'puerta', true),
('A-P2-AULA-19', 'A-P2-PASILLO-DER', 'puerta', true),
('A-P2-PASILLO-DER', 'A-P2-AULA-20', 'puerta', true),
('A-P2-AULA-20', 'A-P2-PASILLO-DER', 'puerta', true),

-- Bloque B - Planta 1
('B-P1-ENTRADA', 'B-P1-PASILLO', 'puerta', true),
('B-P1-PASILLO', 'B-P1-ENTRADA', 'puerta', true),
('B-P1-PASILLO', 'B-P1-AULA-01', 'puerta', true),
('B-P1-AULA-01', 'B-P1-PASILLO', 'puerta', true),
('B-P1-PASILLO', 'B-P1-AULA-02', 'puerta', true),
('B-P1-AULA-02', 'B-P1-PASILLO', 'puerta', true),
('B-P1-PASILLO', 'B-P1-AULA-03', 'puerta', true),
('B-P1-AULA-03', 'B-P1-PASILLO', 'puerta', true),
('B-P1-PASILLO', 'B-P1-AULA-04', 'puerta', true),
('B-P1-AULA-04', 'B-P1-PASILLO', 'puerta', true),
('B-P1-PASILLO', 'B-P1-BANO', 'puerta', true),
('B-P1-BANO', 'B-P1-PASILLO', 'puerta', true),
('B-P1-PASILLO', 'B-P1-ESCALERA', 'pasillo', true),
('B-P1-ESCALERA', 'B-P1-PASILLO', 'pasillo', true),
('B-P1-PASILLO', 'B-P1-ASCENSOR', 'pasillo', true),
('B-P1-ASCENSOR', 'B-P1-PASILLO', 'pasillo', true),

-- Bloque B - Conexión vertical
('B-P1-ESCALERA', 'B-P2-ESCALERA', 'escalera', false),
('B-P2-ESCALERA', 'B-P1-ESCALERA', 'escalera', false),
('B-P1-ASCENSOR', 'B-P2-ASCENSOR', 'ascensor', true),
('B-P2-ASCENSOR', 'B-P1-ASCENSOR', 'ascensor', true),

-- Bloque B - Planta 2
('B-P2-ESCALERA', 'B-P2-PASILLO', 'pasillo', true),
('B-P2-PASILLO', 'B-P2-ESCALERA', 'pasillo', true),
('B-P2-ASCENSOR', 'B-P2-PASILLO', 'pasillo', true),
('B-P2-PASILLO', 'B-P2-ASCENSOR', 'pasillo', true),
('B-P2-PASILLO', 'B-P2-AULA-05', 'puerta', true),
('B-P2-AULA-05', 'B-P2-PASILLO', 'puerta', true),
('B-P2-PASILLO', 'B-P2-AULA-06', 'puerta', true),
('B-P2-AULA-06', 'B-P2-PASILLO', 'puerta', true),
('B-P2-PASILLO', 'B-P2-AULA-07', 'puerta', true),
('B-P2-AULA-07', 'B-P2-PASILLO', 'puerta', true),
('B-P2-PASILLO', 'B-P2-AULA-08', 'puerta', true),
('B-P2-AULA-08', 'B-P2-PASILLO', 'puerta', true),
('B-P2-PASILLO', 'B-P2-AULA-09', 'puerta', true),
('B-P2-AULA-09', 'B-P2-PASILLO', 'puerta', true),
('B-P2-PASILLO', 'B-P2-AULA-10', 'puerta', true),
('B-P2-AULA-10', 'B-P2-PASILLO', 'puerta', true),

-- Bloque C - Dirección / Secretaría
('C-P1-ENTRADA', 'C-P1-DIRECCION', 'puerta', true),
('C-P1-DIRECCION', 'C-P1-ENTRADA', 'puerta', true),
('C-P1-ENTRADA', 'C-P1-SECRETARIA', 'puerta', true),
('C-P1-SECRETARIA', 'C-P1-ENTRADA', 'puerta', true),

-- Bloque D - Gimnasio
('D-P1-ENTRADA', 'D-P1-GIMNASIO', 'puerta', true),
('D-P1-GIMNASIO', 'D-P1-ENTRADA', 'puerta', true)
ON CONFLICT DO NOTHING;
