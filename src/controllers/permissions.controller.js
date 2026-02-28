import pool from "../config/db.js";

export const getAllPermissions = async (req, res, next) => {
  try {
    const query = `
        SELECT per_id,
               per_chave,
               per_descricao
          FROM permissoes;
    `;

    const result= await pool.query(query);

    return res.json({
      status: 'success',
      data: result.rows,
      total: result.rowCount
    });

    } catch (error) {
        next(error);
    }
};  