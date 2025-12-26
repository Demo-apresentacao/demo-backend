import pool from '../config/db.js';
import { hashPassword } from '../utils/password.utils.js';

// Função Auxiliar de Validação
function isValidCPF(cpf) {
  if (!cpf) return false;
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  return true;
}

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function isValidPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  return regex.test(password);
}

// ----------------------------------------------------
//  GET LIST
// ----------------------------------------------------
export const listUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `SELECT usu_id, usu_nome, usu_email, usu_telefone, usu_acesso FROM usuarios`;
    let countQuery = `SELECT COUNT(*) as total FROM usuarios`;
    const values = [];
    
    if (search) {
      const whereClause = ` WHERE usu_nome ILIKE $1 OR usu_email ILIKE $1`;
      queryText += whereClause;
      countQuery += whereClause;
      values.push(`%${search}%`);
    }

    const limitOffsetParams = search ? ` LIMIT $2 OFFSET $3` : ` LIMIT $1 OFFSET $2`;
    queryText += ` ORDER BY usu_id DESC` + limitOffsetParams;
    values.push(limit, offset);

    const result = await pool.query(queryText, values);
    const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    
    const totalItems = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: 'success',
      data: result.rows,
      meta: { totalItems, totalPages, currentPage: parseInt(page), itemsPerPage: parseInt(limit) }
    });
  } catch (error) { next(error); }
};

// ----------------------------------------------------
//  GET BY ID
// ----------------------------------------------------
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM usuarios WHERE usu_id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Usuário não encontrado' });
    }
    return res.json({ status: 'success', data: result.rows[0] });
  } catch (error) { next(error); }
};

// ----------------------------------------------------
//  CREATE USER (CORRIGIDO)
// ----------------------------------------------------
export const createUser = async (req, res, next) => {
  try {
    const {
      usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone,
      usu_email, usu_observ, usu_acesso, usu_senha, usu_situacao
    } = req.body;

    // Validações Básicas
    if (!usu_nome || !usu_cpf || !usu_email || !usu_senha) {
      return res.status(400).json({ status: 'error', message: 'Campos obrigatórios não informados' });
    }

    if (!isValidCPF(usu_cpf)) return res.status(400).json({ status: 'error', message: 'CPF inválido.' });
    if (!isValidEmail(usu_email)) return res.status(400).json({ status: 'error', message: 'Formato de e-mail inválido.' });
    
    if (!isValidPassword(usu_senha)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'A senha deve ter no mínimo 12 caracteres, maiúscula, minúscula, número e especial.' 
      });
    }

    // 🔒 CRIPTOGRAFAR SENHA ANTES DE SALVAR
    const passwordHash = await hashPassword(usu_senha);

    const query = `
      INSERT INTO usuarios (
        usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone,
        usu_email, usu_observ, usu_acesso, usu_senha, usu_situacao
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING usu_id;
    `;

    const values = [
      usu_nome, usu_cpf, usu_data_nasc || null, usu_sexo || null, usu_telefone || null,
      usu_email, usu_observ || null, usu_acesso ?? false, 
      passwordHash, // <--- Enviando o HASH, não a senha pura
      usu_situacao ?? true
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({ status: 'success', message: 'Usuário criado com sucesso', data: result.rows[0] });

  } catch (error) {
     const errorCode = error.code?.toString();
     if (errorCode === '23505') {
        if (error.constraint === 'uk_usuarios_cpf' || (error.detail && error.detail.includes('usu_cpf'))) {
             return res.status(409).json({ status: 'error', message: 'Este CPF já possui cadastro no sistema.' });
        }
        if (error.constraint === 'uk_usuarios_email' || (error.detail && error.detail.includes('usu_email'))) {
             return res.status(409).json({ status: 'error', message: 'Este e-mail já está em uso.' });
        }
        return res.status(409).json({ status: 'error', message: 'Dados duplicados.' });
     }
     next(error);
  }
};


// ----------------------------------------------------
//  UPDATE USER
// ----------------------------------------------------
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone,
      usu_email, usu_observ, usu_acesso, usu_senha, usu_situacao
    } = req.body;

    // 1. Validação CPF
    if (usu_cpf) {
        if (!isValidCPF(usu_cpf)) return res.status(400).json({ status: 'error', message: 'CPF inválido.' });
        const cpfLimpo = usu_cpf.replace(/\D/g, '');
        const cpfCheck = await pool.query(
            `SELECT usu_id FROM usuarios WHERE REGEXP_REPLACE(usu_cpf, '\\D','','g') = $1 AND usu_id != $2`,
            [cpfLimpo, id]
        );
        if (cpfCheck.rowCount > 0) return res.status(409).json({ status: 'error', message: 'CPF já pertence a outro usuário.' });
    }

    // 2. Validação Email
    if (usu_email && !isValidEmail(usu_email)) {
        return res.status(400).json({ status: 'error', message: 'Formato de e-mail inválido.' });
    }

    // 3. Validação e Hash da Senha
    let passwordHash = null; // Inicializa como null

    if (usu_senha) {
        if (!isValidPassword(usu_senha)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A senha deve ter no mínimo 12 caracteres, maiúscula, minúscula, número e especial.' 
            });
        }
        // Se tem senha nova, cria o Hash
        passwordHash = await hashPassword(usu_senha);
    }

    // QUERY INTELIGENTE COM COALESCE
    // COALESCE($9, usu_senha): Se $9 for NULL, ele mantém o valor antigo (usu_senha) do banco.
    const query = `
      UPDATE usuarios
      SET usu_nome = $1, usu_cpf = $2, usu_data_nasc = $3, usu_sexo = $4,
          usu_telefone = $5, usu_email = $6, usu_observ = $7, usu_acesso = $8,
          usu_senha = COALESCE($9, usu_senha), 
          usu_situacao = $10
      WHERE usu_id = $11;
    `;

    await pool.query(query, [
      usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone,
      usu_email, usu_observ, usu_acesso, 
      passwordHash, // Manda o Hash (se existir) ou null
      usu_situacao, id
    ]);

    return res.json({ status: 'success', message: 'Usuário atualizado com sucesso' });

  } catch (error) {
     if (error.code == '23505') {
        if (error.detail && error.detail.includes('usu_cpf')) return res.status(409).json({ status: 'error', message: 'Este CPF já pertence a outro usuário.' });
        return res.status(409).json({ status: 'error', message: 'E-mail ou CPF já em uso.' });
    }
    next(error);
  }
};

// ----------------------------------------------------
//  TOGGLE STATUS & DELETE
// ----------------------------------------------------
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { usu_situacao } = req.body;
    await pool.query(`UPDATE usuarios SET usu_situacao = $1 WHERE usu_id = $2`, [usu_situacao, id]);
    return res.json({ status: 'success', message: `Usuário ${usu_situacao ? 'ativado' : 'desativado'} com sucesso` });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE usu_id = $1;', [id]);
    return res.json({ status: 'success', message: 'Usuário removido com sucesso' });
  } catch (error) { next(error); }
};