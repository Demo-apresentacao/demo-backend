import pool from '../config/db.js';

export const login = async (req, res, next) => {
  try {
    const { usu_email, usu_senha } = req.body;

    // 1. Validação básica de entrada
    if (!usu_email || !usu_senha) {
      return res.status(400).json({
        status: 'error',
        message: 'E-mail e senha são obrigatórios.'
      });
    }

    // 2. Consulta ao banco de dados (Neon Tech)
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

    // 3. Verifica se o usuário existe
    if (result.rowCount === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos.'
      });
    }

    const usuario = result.rows[0];

    // 4. RESPOSTA SIMPLIFICADA
    // Removemos o .cookie() daqui, pois o frontend cuidará disso.
    // Isso evita problemas de CORS e políticas de SameSite:None.
    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso.',
      data: {
        usu_id: usuario.usu_id,
        usu_nome: usuario.usu_nome,
        usu_email: usuario.usu_email,
        usu_acesso: usuario.usu_acesso // Booleano: true para admin, false para user
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    // É importante passar o erro para o middleware de erro do Express
    res.status(500).json({
        status: 'error',
        message: 'Erro interno no servidor.'
    });
  }
};