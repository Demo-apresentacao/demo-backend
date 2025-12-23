export const login = async (req, res, next) => {
    try {
      const { usu_email, usu_senha } = req.body;
  
      // Validação básica
      if (!usu_email || !usu_senha) {
        return res.status(400).json({
          status: 'error',
          message: 'E-mail e senha são obrigatórios.'
        });
      }
  
      const query = `
        SELECT
          user_id,
          user_name,
          user_email,
          user_role
        FROM users
        WHERE user_email = $1
          AND user_password = $2
        LIMIT 1;
      `;
  
      const values = [usu_email, usu_senha];
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'E-mail ou senha inválidos.'
        });
      }
  
      return res.json({
        status: 'success',
        message: 'Login realizado com sucesso.',
        data: result.rows[0]
      });
  
    } catch (error) {
      next(error);
    }
  };
  