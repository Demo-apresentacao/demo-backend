import pool from '../config/db.js';
import { hashPassword } from '../utils/password.utils.js';

// ====================================================
// FUNÇÕES AUXILIARES DE VALIDAÇÃO
// ====================================================

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

function getAgeError(dateString) {
  if (!dateString) return null;
  const birthDate = new Date(dateString); 
  const today = new Date();
  
  if (isNaN(birthDate.getTime())) return "Data inválida.";

  const year = birthDate.getUTCFullYear();
  
  if (year < 1900 || year > today.getFullYear()) {
    return "Ano de nascimento inválido.";
  }

  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs); 
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age < 18) {
    return "Usuário deve ser maior de 18 anos.";
  }
  return null;
}

// ====================================================
// CONTROLLERS
// ====================================================

// ----------------------------------------------------
//  GET LIST (Corrigido: Adicionado usu_situacao)
// ----------------------------------------------------
export const listUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10, status } = req.query; // Recebe 'status'
    const offset = (page - 1) * limit;

    let queryText = `SELECT usu_id, usu_nome, usu_email, usu_telefone, usu_acesso, usu_situacao FROM usuarios`;
    let countQuery = `SELECT COUNT(*) as total FROM usuarios`;
    
    // Array para guardar as condições do WHERE
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // 1. Filtro de Texto (Nome ou Email)
    if (search) {
      conditions.push(`(usu_nome ILIKE $${paramIndex} OR usu_email ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // 2. Filtro de Status (active, inactive, all)
    if (status && status !== 'all') {
      const statusBool = status === 'active'; // se for 'active' vira true, senão false
      conditions.push(`usu_situacao = $${paramIndex}`);
      values.push(statusBool);
      paramIndex++;
    }

    // Monta o WHERE se houver condições
    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(' AND ');
      queryText += whereClause;
      countQuery += whereClause;
    }

    // Paginação
    queryText += ` ORDER BY usu_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(queryText, values);
    
    // Para contar o total, usamos os mesmos valores de filtro (sem limit/offset)
    // Precisamos de um array novo só com os filtros para o count
    const countValues = values.slice(0, paramIndex - 1); 
    const countResult = await pool.query(countQuery, countValues);
    
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
//  CREATE USER
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

    if (usu_data_nasc) {
        const dateError = getAgeError(usu_data_nasc);
        if (dateError) {
             return res.status(400).json({ status: 'error', message: dateError });
        }
    }

    // CRIPTOGRAFAR SENHA ANTES DE SALVAR
    const passwordHash = await hashPassword(usu_senha);

    const query = `
      INSERT INTO usuarios (
        usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone,
        usu_email, usu_observ, usu_acesso, usu_senha, usu_situacao
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING usu_id;
    `;

    const values = [
      usu_nome, usu_cpf, usu_data_nasc || null, usu_sexo ?? null, usu_telefone || null,
      usu_email, usu_observ || null, usu_acesso ?? false, 
      passwordHash, 
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
    let passwordHash = null; 

    if (usu_senha) {
        if (!isValidPassword(usu_senha)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A senha deve ter no mínimo 12 caracteres, maiúscula, minúscula, número e especial.' 
            });
        }
        passwordHash = await hashPassword(usu_senha);
    }

    if (usu_data_nasc) {
        const dateError = getAgeError(usu_data_nasc);
        if (dateError) {
             return res.status(400).json({ status: 'error', message: dateError });
        }
    }

    // COALESCE: Se a senha for enviada como null/undefined no código, mantém a do banco
    const query = `
      UPDATE usuarios
      SET usu_nome = $1, usu_cpf = $2, usu_data_nasc = $3, usu_sexo = $4,
          usu_telefone = $5, usu_email = $6, usu_observ = $7, usu_acesso = $8,
          usu_senha = COALESCE($9, usu_senha), 
          usu_situacao = COALESCE($10, usu_situacao)  -- <--- MUDANÇA AQUI
      WHERE usu_id = $11;
    `;

    await pool.query(query, [
      usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone,
      usu_email, usu_observ, usu_acesso, 
      passwordHash, // Manda o Hash (se existir) ou null
      usu_situacao ?? null, // <--- GARANTA QUE SEJA NULL SE VIER UNDEFINED
      id
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
//  UPDATE USER STATUS (PATCH)
// ----------------------------------------------------
export const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { usu_situacao } = req.body; // Recebe true ou false

    try {
        const query = `
            UPDATE usuarios 
            SET usu_situacao = $1 
            WHERE usu_id = $2
            RETURNING usu_id, usu_nome, usu_situacao;
        `;
        
        const result = await pool.query(query, [usu_situacao, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.json({ 
            status: 'success', 
            message: 'Status atualizado com sucesso.',
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return res.status(500).json({ message: 'Erro interno ao atualizar status.' });
    }
};

// ----------------------------------------------------
//  DELETE USER
// ----------------------------------------------------
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE usu_id = $1;', [id]);
    return res.json({ status: 'success', message: 'Usuário removido com sucesso' });
  } catch (error) { next(error); }
};

// ----------------------------------------------------
//  GET VEHICLES BY USER
// ----------------------------------------------------
export const getUserVehicles = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT v.veic_id, v.veic_placa, m.mod_nome, vu.veic_usu_id
            FROM veiculo_usuario vu
            JOIN veiculos v ON vu.veic_id = v.veic_id
            JOIN modelos m ON v.mod_id = m.mod_id
            WHERE vu.usu_id = $1 AND v.veic_situacao = true
        `;
        const result = await pool.query(query, [id]);
        return res.json(result.rows);
    } catch (error) {
        next(error);
    }
};