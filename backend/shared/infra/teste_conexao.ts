import 'dotenv/config';
import pool from './conexaoDB';

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log(' Conexão com MySQL bem-sucedida!');

    const [rows] = await conn.execute('SELECT 1 + 1 AS resultado');
    console.log('Teste de query:', rows);

    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('Falha na conexão:', error);
    process.exit(1);
  }
}

testConnection();