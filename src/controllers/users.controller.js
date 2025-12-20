import pool from '../config/db.js';

/**
 * Lista todos os usuários cadastrados
 */
export const listUsers = async (req, res, next) => {
  try {
    const query = `
      SELECT
        usu_id,
        usu_nome,
        usu_email,
        usu_telefone,
        usu_acesso,
        usu_situacao
      FROM usuarios
      ORDER BY usu_id;
    `;

    const result = await pool.query(query);

    return res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};
