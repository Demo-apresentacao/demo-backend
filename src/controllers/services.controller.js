import pool from '../config/db.js';

// GET /services
// Lista todos os serviços
// GET /services
// Lista todos os serviços COM FILTROS
export const listServices = async (req, res, next) => {
  try {
    // 1. Recebe parâmetros (search, page, limit e STATUS)
    const { search, page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    // 2. Base da Query
    let queryText = `
      SELECT
        s.serv_id, s.cat_serv_id, cs.cat_serv_nome, s.serv_nome,
        s.serv_duracao, s.serv_preco, s.serv_descricao, s.serv_situacao
      FROM servicos s
      JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM servicos s
      JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
    `;

    // 3. Montagem Dinâmica do WHERE
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filtro de Texto (Nome ou Descrição)
    if (search) {
      conditions.push(`(s.serv_nome ILIKE $${paramIndex} OR s.serv_descricao ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Filtro de Status (active, inactive, all)
    if (status && status !== 'all') {
      const statusBool = status === 'active'; // true ou false
      conditions.push(`s.serv_situacao = $${paramIndex}`);
      values.push(statusBool);
      paramIndex++;
    }

    // Aplica o WHERE se houver condições
    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(' AND ');
      queryText += whereClause;
      countQuery += whereClause;
    }

    // 4. Ordenação e Paginação
    queryText += ` ORDER BY s.serv_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    // 5. Execução
    const result = await pool.query(queryText, values);
    
    // Para o count, usamos os values apenas dos filtros (sem limit/offset)
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
      FROM servicos s
      JOIN categorias_servicos cs
        ON s.cat_serv_id = cs.cat_serv_id
      WHERE s.cat_serv_id = $1
      ORDER BY s.serv_id;
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
      serv_situacao
    } = req.body;

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
      RETURNING serv_id;
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
      data: {
        serv_id: result.rows[0].serv_id
      }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /services/:serv_id
// Atualiza os dados de um serviço
export const updateService = async (req, res, next) => {
  try {
    const { serv_id } = req.params;
    const {
      cat_serv_id,
      serv_nome,
      serv_duracao,
      serv_preco,
      serv_descricao,
      serv_situacao
    } = req.body;

    const query = `
      UPDATE servicos
      SET
        cat_serv_id = $1,
        serv_nome = $2,
        serv_duracao = $3,
        serv_preco = $4,
        serv_descricao = $5,
        serv_situacao = $6
      WHERE serv_id = $7;
    `;

    const values = [
      cat_serv_id,
      serv_nome,
      serv_duracao,
      serv_preco,
      serv_descricao,
      serv_situacao,
      serv_id
    ];

    await pool.query(query, values);

    return res.json({
      status: 'success',
      message: `Serviço ${serv_id} atualizado com sucesso`
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /services/:serv_id/status
// Ativa ou desativa um serviço
export const toggleServiceStatus = async (req, res, next) => {
  try {
    const { serv_id } = req.params;
    const { serv_situacao } = req.body;

    const query = `
      UPDATE servicos
      SET serv_situacao = $1
      WHERE serv_id = $2;
    `;

    await pool.query(query, [serv_situacao, serv_id]);

    return res.json({
      status: 'success',
      message: `Serviço ${serv_id} ${
        serv_situacao ? 'ativado' : 'desativado'
      } com sucesso`
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
      WHERE serv_id = $1;
    `;

    await pool.query(query, [serv_id]);

    return res.json({
      status: 'success',
      message: `Serviço ${serv_id} removido com sucesso`
    });
  } catch (error) {
    next(error);
  }
};