import pool from '../config/db.js';
import { sendEmail } from '../utils/email.utils.js';
import crypto from 'crypto';
// 1. IMPORTAMOS SUA FUNÇÃO AQUI
import { hashPassword } from '../utils/password.utils.js'; 

// 1. SOLICITAR REDEFINIÇÃO
export const forgotPassword = async (req, res, next) => {
  try {
    const { usu_email } = req.body;

    const userQuery = await pool.query('SELECT * FROM usuarios WHERE usu_email = $1', [usu_email]);
    
    if (userQuery.rowCount === 0) {
      return res.status(404).json({ status: 'error', message: 'E-mail não encontrado.' });
    }

    const user = userQuery.rows[0];

    // Gera token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salva no banco (Colunas em PT-BR)
    await pool.query(
      'UPDATE usuarios SET usu_token_reset = $1, usu_expiracao_token = $2 WHERE usu_id = $3',
      [resetToken, resetExpires, user.usu_id]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset/${resetToken}`;
    const message = `Você solicitou a troca de senha.\n\nClique no link: ${resetUrl}`;

    try {
      await sendEmail({
        email: user.usu_email,
        subject: 'Recuperação de Senha - Urban',
        message: message
      });

      res.status(200).json({ status: 'success', message: 'E-mail enviado!' });
    } catch (err) {
      await pool.query(
        'UPDATE usuarios SET usu_token_reset = NULL, usu_expiracao_token = NULL WHERE usu_id = $1',
        [user.usu_id]
      );
      return res.status(500).json({ message: 'Erro ao enviar e-mail.' });
    }
  } catch (error) {
    next(error);
  }
};

// 2. RESETAR A SENHA
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params; 
    const { usu_senha } = req.body;

    const query = `
      SELECT * FROM usuarios 
      WHERE usu_token_reset = $1 
      AND usu_expiracao_token > NOW()
    `;
    
    const result = await pool.query(query, [token]);

    if (result.rowCount === 0) {
      return res.status(400).json({ status: 'error', message: 'Token inválido ou expirado.' });
    }

    const user = result.rows[0];

    // 2. USAMOS SUA FUNÇÃO UTIL AQUI (Muito mais limpo!)
    const newPasswordHash = await hashPassword(usu_senha);

    // Atualiza senha e limpa tokens
    await pool.query(
      `UPDATE usuarios 
       SET usu_senha = $1, 
           usu_token_reset = NULL, 
           usu_expiracao_token = NULL 
       WHERE usu_id = $2`,
      [newPasswordHash, user.usu_id]
    );

    res.status(200).json({ status: 'success', message: 'Senha alterada com sucesso!' });

  } catch (error) {
    next(error);
  }
};