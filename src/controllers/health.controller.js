import pool from '../config/db.js';

export const checkHealth = async (req, res, next) => {
  try {
    // Testa conexão com o banco
    await pool.query('SELECT 1');

    return res.status(200).json({
      status: 'success',
      message: 'API está saudável',
      uptime: process.uptime(),
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Erro no health check:', error);

    return res.status(500).json({
      status: 'error',
      message: 'API indisponível',
      timestamp: new Date()
    });
  }
};