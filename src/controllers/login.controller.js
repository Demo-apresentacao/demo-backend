import pool from '../config/db.js';
// Importamos a comparação
import { comparePassword } from '../utils/password.utils.js';

export const login = async (req, res, next) => {
  try {
    const { usu_email, usu_senha } = req.body;

    if (!usu_email || !usu_senha) {
      return res.status(400).json({ status: 'error', message: 'E-mail e senha são obrigatórios.' });
    }

    // 1. ATUALIZAÇÃO AQUI: Adicionei 'usu_situacao' na busca
    const query = `
      SELECT 
        usu_id, usu_nome, usu_email, usu_acesso, usu_senha, usu_situacao 
      FROM usuarios 
      WHERE usu_email = $1 
      LIMIT 1;
    `;

    const result = await pool.query(query, [usu_email]);

    // 2. Se não achou o email, rejeita
    if (result.rowCount === 0) {
      return res.status(401).json({ status: 'error', message: 'E-mail ou senha inválidos.' });
    }

    const usuario = result.rows[0];

    // --- NOVA VALIDAÇÃO DE STATUS ---
    // --- VALIDAÇÃO DE STATUS (Mensagem Melhorada) ---
    if (!usuario.usu_situacao) {
        return res.status(403).json({ 
            status: 'error', 
            // Mensagem personalizada que vai aparecer no SweetAlert
            message: 'Seu usuário está inativo. Por favor, entre em contato com o administrador do sistema para regularizar seu acesso.' 
        });
    }

    // 3. COMPARA A SENHA ENVIADA COM O HASH DO BANCO
    const isMatch = await comparePassword(usu_senha, usuario.usu_senha);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'E-mail ou senha inválidos.' });
    }

    // 4. RETORNA SUCESSO
    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso.',
      data: {
        usu_id: usuario.usu_id,
        usu_nome: usuario.usu_nome,
        usu_email: usuario.usu_email,
        usu_acesso: usuario.usu_acesso
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
  }
};