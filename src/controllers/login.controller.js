import pool from '../config/db.js';
import { comparePassword } from '../utils/password.utils.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    // 1. AJUSTE: Aceita tanto 'email' (do front) quanto 'usu_email'
    const { email, password, usu_email, usu_senha } = req.body;

    const emailFinal = email || usu_email;
    const senhaFinal = password || usu_senha;

    if (!emailFinal || !senhaFinal) {
      return res.status(400).json({ status: 'error', message: 'E-mail e senha são obrigatórios.' });
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

    // 2. Se não achou o email, rejeita
    if (result.rowCount === 0) {
      return res.status(401).json({ status: 'error', message: 'E-mail ou senha inválidos.' });
    }

    const usuario = result.rows[0];

    // --- VALIDAÇÃO DE STATUS ---
    if (!usuario.usu_situacao) {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Seu usuário está inativo. Contate o administrador.' 
        });
    }

    // 3. COMPARA A SENHA
    const isMatch = await comparePassword(senhaFinal, usuario.usu_senha);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'E-mail ou senha inválidos.' });
    }

    // 4. GERA O TOKEN
    const token = jwt.sign(
      {
        usu_id: usuario.usu_id,
        usu_email: usuario.usu_email,
        usu_acesso: usuario.usu_acesso  
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 5. RETORNA SUCESSO
    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso.',
      token, // O Frontend vai pegar isso aqui e salvar no Cookie
      data: {
        usu_id: usuario.usu_id,
        usu_nome: usuario.usu_nome,
        usu_email: usuario.usu_email,
        usu_acesso: usuario.usu_acesso,
        role: usuario.usu_acesso // Adicionei 'role' para facilitar o front se precisar
      }
    });

  } catch (error) {
    // 6. AJUSTE: Usa o next(error) para o middleware do app.js pegar
    console.error("Erro no login:", error);
    next(error);
  }
};