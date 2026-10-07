import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './conexion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inicializarBaseDeDatos() {
  console.log('🔄 Iniciando configuración de la base de datos de AccessiRoute...');

  try {
    // 1. Leer y ejecutar el esquema de tablas
    const rutaEsquema = path.join(__dirname, 'esquema.sql');
    const sqlEsquema = await fs.readFile(rutaEsquema, 'utf-8');
    await pool.query(sqlEsquema);
    console.log('✅ Tablas creadas o verificadas con éxito (esquema.sql).');

    // 2. Leer y ejecutar las semillas (datos reales del centro)
    const rutaSemillas = path.join(__dirname, 'semillas.sql');
    const sqlSemillas = await fs.readFile(rutaSemillas, 'utf-8');
    await pool.query(sqlSemillas);
    console.log('✅ Espacios y conexiones reales del instituto insertados con éxito (semillas.sql).');

    // 3. Comprobación y conteo
    const { rows: conteoEspacios } = await pool.query('SELECT COUNT(*) AS total FROM espacios;');
    const { rows: conteoConexiones } = await pool.query('SELECT COUNT(*) AS total FROM conexiones;');

    console.log('\n📊 Resumen de datos en PostgreSQL:');
    console.log(`   - Total de espacios registrados: ${conteoEspacios[0].total}`);
    console.log(`   - Total de conexiones de grafo: ${conteoConexiones[0].total}`);
    console.log('\n🎉 ¡Base de datos de AccessiRoute lista para su uso!\n');
  } catch (error) {
    console.error('❌ Error durante la inicialización de la base de datos:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

inicializarBaseDeDatos();
