import pool from '../config/db.js';

export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {

      const userId = req.user.id;

      const result = await pool.query(
        `
        SELECT EXISTS (
              SELECT 1
                FROM usuario_permissoes AS up
          INNER JOIN permissoes AS p ON up.per_id = p.per_id
          WHERE up.usu_id = $1
            AND p.per_chave = $2
        ) AS "hasPermission"
        `,
        [userId, permissionName]
      );

      const hasPermission = result.rows[0].hasPermission;

      if (!hasPermission) {
        return res.status(403).json({
          status: 'error',
          message: 'Usuário não possui permissão para esta ação.'
        });
      }

      next();

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao verificar permissões.'
      });
    }
  };
};