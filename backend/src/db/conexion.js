import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Creamos un pool de conexiones reutilizables hacia PostgreSQL
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'accessiroute',
  user: process.env.DB_USER || 'accessiuser',
  password: process.env.DB_PASSWORD || 'accessipass',
});

// Captura de errores inesperados en conexiones inactivas
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});
