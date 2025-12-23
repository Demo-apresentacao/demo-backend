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
          usu_id,
          usu_name,
          usu_email,
          usu_role
        FROM usuarios
        WHERE usu_email = $1
          AND usu_password = $2
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
      console.log("Erro no login:", error);
        next(error);
    }
  };
  