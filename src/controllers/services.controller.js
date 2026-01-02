import pool from '../config/db.js';

// GET /services
// Lista todos os serviços
export const listServices = async (req, res, next) => {
  try {
    const { 
        search, 
        page = 1, 
        limit = 10, 
        status,
        orderBy = 'serv_id',
        orderDirection = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // --- LÓGICA DE ORDENAÇÃO SEGURA ---
    const sortableColumns = ['serv_id', 'serv_nome', 'serv_preco', 'serv_duracao', 'serv_situacao'];
    const safeColumn = sortableColumns.includes(orderBy) ? orderBy : 'serv_id';
    const safeDirection = orderDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    const orderByClause = `ORDER BY s.${safeColumn} ${safeDirection}`;

    // --- MONTAGEM DA QUERY ---
    let queryText = `
      SELECT
            s.serv_id, s.cat_serv_id, cs.cat_serv_nome, s.serv_nome,
            s.serv_duracao, s.serv_preco, s.serv_descricao, s.serv_situacao
      FROM  servicos s
      JOIN  categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM servicos s
      JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
    `;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filtros
    if (search) {
      conditions.push(`(s.serv_nome ILIKE $${paramIndex} OR s.serv_descricao ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (status && status !== 'all') {
      const statusBool = status === 'active';
      conditions.push(`s.serv_situacao = $${paramIndex}`);
      values.push(statusBool);
      paramIndex++;
    }

    // Aplica WHERE
    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(' AND ');
      queryText += whereClause;
      countQuery += whereClause;
    }

    // Aplica ORDER BY e Paginação
    queryText += ` ${orderByClause} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    // Executa
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

  } catch (error) {
    next(error);
  }
};

// GET /services/category/:cat_serv_id
// Lista serviços por categoria
export const listServicesByCategory = async (req, res, next) => {
  try {
    const { cat_serv_id } = req.params;

    const query = `
      SELECT
              s.serv_id,
              s.cat_serv_id,
              cs.cat_serv_nome,
              s.serv_nome,
              s.serv_duracao,
              s.serv_preco,
              s.serv_descricao,
              s.serv_situacao
        FROM  servicos s
        JOIN  categorias_servicos cs
          ON  s.cat_serv_id = cs.cat_serv_id
        WHERE s.cat_serv_id = $1
        ORDER BY s.serv_nome ASC;
    `;

    const result = await pool.query(query, [cat_serv_id]);

    return res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// GET /services/:serv_id
// Busca um serviço pelo ID
export const getServiceById = async (req, res, next) => {
  try {
    const { serv_id } = req.params;

    const query = `
      SELECT
              s.serv_id,
              s.cat_serv_id,
              cs.cat_serv_nome,
              s.serv_nome,
              s.serv_duracao,
              s.serv_preco,
              s.serv_descricao,
              s.serv_situacao
      FROM servicos s
      JOIN categorias_servicos cs
        ON s.cat_serv_id = cs.cat_serv_id
      WHERE s.serv_id = $1;
    `;

    const result = await pool.query(query, [serv_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Serviço não encontrado'
      });
    }

    return res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// POST /services
export const createService = async (req, res, next) => {
  try {
    const {
      cat_serv_id,
      serv_nome,
      serv_duracao,
      serv_preco,
      serv_descricao,
      serv_situacao = true // Default para true
    } = req.body;

    if (!serv_nome || !serv_preco || !cat_serv_id) {
        return res.status(400).json({ status: 'error', message: "Nome, preço e categoria são obrigatórios." });
    }

    const query = `
      INSERT INTO servicos (
        cat_serv_id,
        serv_nome,
        serv_duracao,
        serv_preco,
        serv_descricao,
        serv_situacao
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      cat_serv_id,
      serv_nome,
      serv_duracao,
      serv_preco,
      serv_descricao,
      serv_situacao
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Serviço criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /services/:serv_id
// Atualiza os dados de um serviço (Dinâmico)
export const updateService = async (req, res, next) => {
  try {
    const { serv_id } = req.params;
    const updates = req.body;

    // 1. Verifica se enviou algum dado
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ status: 'error', message: 'Nenhum campo fornecido para atualização.' });
    }

    // 2. Montagem Dinâmica da Query
    const fields = [];
    const values = [];
    let index = 1;

    const allowedFields = ['cat_serv_id', 'serv_nome', 'serv_duracao', 'serv_preco', 'serv_descricao', 'serv_situacao'];

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

    values.push(serv_id);

    const query = `
      UPDATE servicos
      SET ${fields.join(', ')}
      WHERE serv_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: "Serviço não encontrado" });
    }

    return res.json({
      status: 'success',
      message: `Serviço atualizado com sucesso`,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /services/:serv_id/status
// Ativa ou desativa um serviço (Atalho útil)
export const toggleServiceStatus = async (req, res, next) => {
  try {
    const { serv_id } = req.params;
    const { serv_situacao } = req.body;

    if (serv_situacao === undefined) {
        return res.status(400).json({ status: 'error', message: "O campo serv_situacao é obrigatório." });
    }

    const query = `
      UPDATE servicos
      SET serv_situacao = $1
      WHERE serv_id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [serv_situacao, serv_id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: "Serviço não encontrado" });
    }

    return res.json({
      status: 'success',
      message: `Serviço ${serv_situacao ? 'ativado' : 'desativado'} com sucesso`,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /services/:serv_id
// Remove um serviço
export const deleteService = async (req, res, next) => {
  try {
    const { serv_id } = req.params;

    const query = `
      DELETE FROM servicos
      WHERE serv_id = $1
      RETURNING serv_id;
    `;

    const result = await pool.query(query, [serv_id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: "Serviço não encontrado" });
    }

    return res.json({
      status: 'success',
      message: `Serviço removido com sucesso`
    });
  } catch (error) {
    // Erro de chave estrangeira (se o serviço já foi usado em agendamentos)
    if (error.code === '23503') {
        return res.status(409).json({
            status: 'error',
            message: 'Não é possível excluir este serviço pois ele já está vinculado a agendamentos.'
        });
    }
    next(error);
  }
};