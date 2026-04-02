import pool from '../config/db.js';
import { comparePassword } from '../utils/password.utils.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    // 1. Aceita ambos os formatos (frontend/back)
    const { email, password, usu_email, usu_senha } = req.body;

    const emailFinal = email || usu_email;
    const senhaFinal = password || usu_senha;

    if (!emailFinal || !senhaFinal) {
      return res.status(400).json({
        status: 'error',
        message: 'E-mail e senha são obrigatórios.'
      });
    }

    const query = `
      SELECT usu_id, 
             usu_nome, 
             usu_email, 
             usu_acesso, 
             usu_senha, 
             usu_situacao 
        FROM usuarios 
       WHERE usu_email = $1
       LIMIT 1;
    `;

    const result = await pool.query(query, [emailFinal]);

    // 3. Verifica se o usuário existe
    if (result.rowCount === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos.'
      });
    }

    const usuario = result.rows[0];

    // 4. Verifica se o usuário está inativo
    if (usuario.usu_situacao === false) {
      return res.status(403).json({
        status: 'error',
        message: 'Seu usuário está inativo. Contate o administrador.'
      });
    }

    // 5. Valida a senha
    const isMatch = await comparePassword(senhaFinal, usuario.usu_senha);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos.'
      });
    }

    // 6. Gera o token JWT
    const token = jwt.sign(
      {
        usu_id: usuario.usu_id,
        usu_email: usuario.usu_email,
        usu_acesso: usuario.usu_acesso
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 7. Retorna sucesso
    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso.',
      token,
      data: {
        usu_id: usuario.usu_id,
        usu_nome: usuario.usu_nome,
        usu_email: usuario.usu_email,
        usu_acesso: usuario.usu_acesso,
        role: usuario.usu_acesso
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    next(error);
  }
};


export const getMe = async (req, res) => {
  try {

console.log("req.user:", req.user); // 👈 veja se tem id

    const userId = req.user.id;

    // 1️⃣ Buscar usuário
    const userResult = await pool.query(
      `
      SELECT usu_id, 
             usu_nome, 
             usu_email,
             usu_acesso
        FROM usuarios
       WHERE usu_id = $1
      `,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }

    const user = userResult.rows[0];

    // 2️⃣ Buscar permissões
    const permissionsResult = await pool.query(
      `
          SELECT p.per_chave
            FROM usuario_permissoes AS up
      INNER JOIN permissoes AS p ON up.per_id = p.per_id
           WHERE up.usu_id = $1
      `,
      [userId]
    );

    const permissoes = permissionsResult.rows.map(p => p.per_chave);

    // 3️⃣ Retornar tudo
    return res.json({
      id: user.usu_id,
      nome: user.usu_nome,
      email: user.usu_email,
      acesso: user.usu_acesso,
      permissoes
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar usuário.'
    });
  }
};