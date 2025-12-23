import pool from '../config/db.js';

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
        usu_nome,
        usu_email,
        usu_acesso
      FROM usuarios
      WHERE usu_email = $1
        AND usu_senha = $2
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

    const usuario = result.rows[0];

    // 🔥 AQUI ESTÁ A PARTE QUE FALTAVA
    return res
      .cookie('logged', 'true', {
        httpOnly: false,      // middleware precisa ler
        sameSite: 'lax',
        secure: true,         // HTTPS (Render + Vercel)
      })
      .cookie(
        'role',
        usuario.usu_acesso ? 'admin' : 'user',
        {
          httpOnly: false,
          sameSite: 'lax',
          secure: true,
        }
      )
      .json({
        status: 'success',
        message: 'Login realizado com sucesso.',
        data: usuario
      });

  } catch (error) {
    console.log("Erro no login:", error);
    next(error);
  }
};
