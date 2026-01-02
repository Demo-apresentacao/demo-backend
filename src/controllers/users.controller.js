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
//  GET LIST
// ----------------------------------------------------
export const listUsers = async (req, res, next) => {
  try {
    const { 
        search, 
        page = 1, 
        limit = 10, 
        status, 
        orderBy = 'usu_id', 
        orderDirection = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const sortableColumns = ['usu_id', 'usu_nome', 'usu_email', 'usu_situacao', 'usu_acesso'];
    const safeOrderBy = sortableColumns.includes(orderBy) ? orderBy : 'usu_id';
    const safeOrderDirection = orderDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let queryText = `SELECT usu_id, usu_nome, usu_email, usu_telefone, usu_acesso, usu_situacao FROM usuarios`;
    let countQuery = `SELECT COUNT(*) as total FROM usuarios`;
    
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filtros
    if (search) {
      conditions.push(`(usu_nome ILIKE $${paramIndex} OR usu_email ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (status && status !== 'all') {
      const statusBool = status === 'active';
      conditions.push(`usu_situacao = $${paramIndex}`);
      values.push(statusBool);
      paramIndex++;
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(' AND ');
      queryText += whereClause;
      countQuery += whereClause;
    }

    queryText += ` ORDER BY ${safeOrderBy} ${safeOrderDirection} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(queryText, values);
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
    // Remove a senha do retorno por segurança
    const user = result.rows[0];
    delete user.usu_senha;

    return res.json({ status: 'success', data: user });
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
      return res.status(400).json({ status: 'error', message: 'Campos obrigatórios (Nome, CPF, Email, Senha) não informados.' });
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

    // CRIPTOGRAFAR SENHA
    const passwordHash = await hashPassword(usu_senha);

    const query = `
      INSERT INTO usuarios (
        usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone,
        usu_email, usu_observ, usu_acesso, usu_senha, usu_situacao
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      usu_nome, usu_cpf, usu_data_nasc || null, usu_sexo ?? null, usu_telefone || null,
      usu_email, usu_observ || null, usu_acesso ?? false, 
      passwordHash, 
      usu_situacao ?? true
    ];

    const result = await pool.query(query, values);
    
    // Remove a senha do retorno
    delete result.rows[0].usu_senha;

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
//  UPDATE USER (PATCH Dinâmico e Seguro)
// ----------------------------------------------------
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 1. Verifica se enviou algum dado
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ status: 'error', message: 'Nenhum campo fornecido para atualização.' });
    }

    // --- VALIDAÇÕES CONDICIONAIS ---

    // Validação CPF
    if (updates.usu_cpf) {
        if (!isValidCPF(updates.usu_cpf)) return res.status(400).json({ status: 'error', message: 'CPF inválido.' });
        const cpfLimpo = updates.usu_cpf.replace(/\D/g, '');
        const cpfCheck = await pool.query(
            `SELECT usu_id FROM usuarios WHERE REGEXP_REPLACE(usu_cpf, '\\D','','g') = $1 AND usu_id != $2`,
            [cpfLimpo, id]
        );
        if (cpfCheck.rowCount > 0) return res.status(409).json({ status: 'error', message: 'CPF já pertence a outro usuário.' });
    }

    // Validação Email
    if (updates.usu_email && !isValidEmail(updates.usu_email)) {
        return res.status(400).json({ status: 'error', message: 'Formato de e-mail inválido.' });
    }

    // Validação Senha (Se vier senha, hasheia ela)
    if (updates.usu_senha) {
        if (!isValidPassword(updates.usu_senha)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A senha deve ter no mínimo 12 caracteres, maiúscula, minúscula, número e especial.' 
            });
        }
        // Substitui a senha em texto plano pelo hash
        updates.usu_senha = await hashPassword(updates.usu_senha);
    }

    // Validação Idade
    if (updates.usu_data_nasc) {
        const dateError = getAgeError(updates.usu_data_nasc);
        if (dateError) {
             return res.status(400).json({ status: 'error', message: dateError });
        }
    }

    // --- MONTAGEM DINÂMICA DA QUERY ---
    const fields = [];
    const values = [];
    let index = 1;

    const allowedFields = [
        'usu_nome', 'usu_cpf', 'usu_data_nasc', 'usu_sexo', 
        'usu_telefone', 'usu_email', 'usu_observ', 
        'usu_acesso', 'usu_senha', 'usu_situacao'
    ];

    for (const key in updates) {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = $${index}`);
            values.push(updates[key]);
            index++;
        }
    }

    if (fields.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Nenhum campo válido para atualização.' });
    }

    values.push(id);

    const query = `
      UPDATE usuarios
      SET ${fields.join(', ')}
      WHERE usu_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: "Usuário não encontrado" });
    }

    // Remove a senha do retorno
    delete result.rows[0].usu_senha;

    return res.json({ 
        status: 'success', 
        message: 'Usuário atualizado com sucesso',
        data: result.rows[0]
    });

  } catch (error) {
     if (error.code == '23505') {
        if (error.detail && error.detail.includes('usu_cpf')) return res.status(409).json({ status: 'error', message: 'Este CPF já pertence a outro usuário.' });
        return res.status(409).json({ status: 'error', message: 'E-mail ou CPF já em uso.' });
    }
    next(error);
  }
};

// ----------------------------------------------------
//  UPDATE USER STATUS (Atalho Útil)
// ----------------------------------------------------
export const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { usu_situacao } = req.body; 

        if (usu_situacao === undefined) {
             return res.status(400).json({ status: 'error', message: 'O campo usu_situacao é obrigatório.' });
        }

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
        next(error);
    }
};

// ----------------------------------------------------
//  DELETE USER
// ----------------------------------------------------
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verifica se existe
    const check = await pool.query('SELECT usu_id FROM usuarios WHERE usu_id = $1', [id]);
    if (check.rowCount === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });

    await pool.query('DELETE FROM usuarios WHERE usu_id = $1;', [id]);
    return res.json({ status: 'success', message: 'Usuário removido com sucesso' });
  } catch (error) { 
      // Proteção contra erro de Chave Estrangeira (se o usuário tem carros ou agendamentos)
      if (error.code === '23503') {
          return res.status(409).json({ 
              status: 'error', 
              message: 'Não é possível excluir este usuário pois ele possui veículos ou agendamentos vinculados. Considere inativá-lo.' 
          });
      }
      next(error); 
  }
};

// ----------------------------------------------------
//  GET VEHICLES BY USER
// ----------------------------------------------------
export const getUserVehicles = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Adicionamos: AND vu.data_final IS NULL
        const query = `
            SELECT v.veic_id, v.veic_placa, m.mod_nome, vu.veic_usu_id
            FROM veiculo_usuario vu
            JOIN veiculos v ON vu.veic_id = v.veic_id
            JOIN modelos m ON v.mod_id = m.mod_id
            WHERE vu.usu_id = $1 
              AND v.veic_situacao = true
              AND vu.data_final IS NULL
        `;
        
        const result = await pool.query(query, [id]);
        return res.json({ status: 'success', data: result.rows });
    } catch (error) {
        next(error);
    }
};