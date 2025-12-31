import pool from '../config/db.js';

// GET /vehicles
// Lista todos os veículos
export const listVehicles = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Status
    let status = req.query.status;
    if (!status || status === 'null' || status === 'undefined') {
        status = 'all';
    }

    // Novos parâmetros de Ordenação
    const { orderBy = 'veic_id', orderDirection = 'DESC' } = req.query;

    // --- MAPA DE ORDENAÇÃO ---
    // Traduz o campo do frontend para o campo do banco com alias correto
    const sortMap = {
        'veic_id': 'v.veic_id',
        'modelo': 'mo.mod_nome',
        'marca': 'm.mar_nome',
        'veic_placa': 'v.veic_placa',
        'veic_situacao': 'v.veic_situacao'
        // 'proprietarios' é complexo de ordenar pois é um agregado, melhor não incluir por enquanto
    };

    const safeOrderBy = sortMap[orderBy] || 'v.veic_id';
    const safeOrderDirection = orderDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filtros
    if (status !== 'all') {
      const isActive = (status === 'active');
      conditions.push(`v.veic_situacao = $${paramIndex}`);
      values.push(isActive);
      paramIndex++;
    } 

    if (search) {
      conditions.push(`
        (
          v.veic_placa ILIKE $${paramIndex}
          OR mo.mod_nome ILIKE $${paramIndex}
          OR m.mar_nome ILIKE $${paramIndex}
          OR u.usu_nome ILIKE $${paramIndex}
        )
      `);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query Principal
    const queryText = `
      SELECT
        v.veic_id,
        mo.mod_nome AS modelo,
        v.veic_placa,
        v.veic_ano,
        v.veic_cor,
        v.veic_combustivel,
        v.veic_observ,
        v.veic_situacao,
        m.mar_nome AS marca,
        STRING_AGG(DISTINCT u.usu_nome, ', ') AS proprietarios,
        COUNT(DISTINCT u.usu_id) AS num_proprietarios
      FROM veiculos v
      LEFT JOIN modelos mo ON v.mod_id = mo.mod_id
      LEFT JOIN marcas m ON mo.mar_id = m.mar_id
      LEFT JOIN veiculo_usuario vu ON v.veic_id = vu.veic_id AND vu.data_final IS NULL
      LEFT JOIN usuarios u ON vu.usu_id = u.usu_id
      ${whereClause}
      GROUP BY
        v.veic_id, mo.mod_nome, m.mar_nome, v.veic_placa,
        v.veic_ano, v.veic_cor, v.veic_combustivel, v.veic_observ, v.veic_situacao
      ORDER BY ${safeOrderBy} ${safeOrderDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(queryText, values);

    // Query de Contagem
    const countQuery = `
      SELECT COUNT(DISTINCT v.veic_id) AS total
      FROM veiculos v
      LEFT JOIN modelos mo ON v.mod_id = mo.mod_id
      LEFT JOIN marcas m ON mo.mar_id = m.mar_id
      LEFT JOIN veiculo_usuario vu ON v.veic_id = vu.veic_id AND vu.data_final IS NULL
      LEFT JOIN usuarios u ON vu.usu_id = u.usu_id
      ${whereClause}
    `;

    const countValues = values.slice(0, paramIndex - 1);
    const countResult = await pool.query(countQuery, countValues);

    const totalItems = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: 'success',
      data: result.rows,
      meta: { totalItems, totalPages, currentPage: page, itemsPerPage: limit },
    });

  } catch (error) {
    console.error("❌ ERRO GRAVE NO CONTROLLER:", error);
    next(error);
  }
};

// GET /vehicles/:id
// Busca um veículo pelo ID
export const getVehicleById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
           SELECT v.veic_id,
                  c.cat_id,
                  mo.mod_id,
                  mo.mod_nome,
                  v.veic_placa,
                  v.veic_ano,
                  v.veic_cor,
                  v.veic_combustivel,
                  v.veic_observ,
                  v.veic_situacao,
                  m.mar_id,
                  m.mar_nome,
                  c.cat_nome,
                  STRING_AGG(DISTINCT u.usu_nome, ', ') AS proprietarios,
                  COUNT(DISTINCT vu.usu_id) AS num_proprietarios
             FROM veiculos AS v
             JOIN modelos         AS mo ON v.mod_id  = mo.mod_id
             JOIN marcas          AS m ON mo.mar_id  = m.mar_id
        LEFT JOIN categorias      AS c ON m.cat_id   = c.cat_id
        LEFT JOIN veiculo_usuario AS vu ON v.veic_id = vu.veic_id
        LEFT JOIN usuarios        AS u ON vu.usu_id  = u.usu_id
            WHERE v.veic_id = $1
         GROUP BY v.veic_id,
                  c.cat_id,
                  mo.mod_id,
                  mo.mod_nome,
                  m.mar_id,
                  m.mar_nome,
                  c.cat_nome;
    `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Veículo não encontrado'
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

// POST /vehicles
// Cadastra um novo veículo
export const createVehicle = async (req, res, next) => {
    try {
        const {
            mod_id,
            veic_placa,
            veic_ano,
            veic_cor,
            veic_combustivel,
            veic_observ,
            veic_situacao
        } = req.body;


        const currentYear = new Date().getFullYear();
        if (parseInt(veic_ano) > currentYear + 1) {
            return res.status(400).json({
                status: 'error',
                message: `O ano do veículo não pode ser maior que ${currentYear + 1}`
            });
        }

        const checkQuery = `
        SELECT veic_id
          FROM veiculos
         WHERE veic_placa = $1
         LIMIT 1;
    `;

        const checkResult = await pool.query(checkQuery, [veic_placa.toUpperCase()]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Placa já cadastrada'
            });
        }

        const insertQuery = `
        INSERT INTO veiculos ( mod_id,
                               veic_placa,
                               veic_ano,
                               veic_cor,
                               veic_combustivel,
                               veic_observ,
                               veic_situacao
                              )
                       VALUES ($1, $2, $3, $4, $5, $6, $7)
                       RETURNING veic_id;
    `;

        const values = [
            mod_id,
            veic_placa.toUpperCase(),
            veic_ano,
            veic_cor,
            veic_combustivel,
            veic_observ,
            veic_situacao
        ];

        const result = await pool.query(insertQuery, values);

        return res.status(201).json({
            status: 'success',
            data: { veic_id: result.rows[0].veic_id }
        });
    } catch (error) {
        next(error);
    }
};

/**
// PATCH /vehicles/user/:veic_id
// Usuário edita apenas dados básicos do veículo
*/
export const updateVehicleByUser = async (req, res, next) => {
    try {
        const { veic_id } = req.params;
        const {
            mod_id,
            veic_placa,
            veic_ano,
            veic_cor,
            veic_combustivel,
            veic_observ
        } = req.body;


        const currentYear = new Date().getFullYear();
        if (parseInt(veic_ano) > currentYear + 1) {
            return res.status(400).json({
                status: 'error',
                message: `O ano do veículo não pode ser maior que ${currentYear + 1}`
            });
        }

        const query = `
      UPDATE veiculos
      SET
        mod_id = $1,
        veic_placa = UPPER($2),
        veic_ano = $3,
        veic_cor = $4,
        veic_combustivel = $5,
        veic_observ = $6
      WHERE veic_id = $7
      RETURNING veic_id;
    `;

        const values = [
            mod_id,
            veic_placa,
            veic_ano,
            veic_cor,
            veic_combustivel,
            veic_observ,
            veic_id
        ];

        const { rowCount } = await pool.query(query, values);

        if (!rowCount) {
            return res.status(404).json({ status: 'error', message: 'Veículo não encontrado' });
        }

        res.json({ status: 'success', message: 'Veículo atualizado pelo usuário' });
    } catch (error) {
        next(error);
    }
};

/**
// PATCH /vehicles/:veic_id
// Admin edita todos os dados do veículo
*/
export const updateVehicleByAdmin = async (req, res, next) => {
    try {
        const { veic_id } = req.params;
        const {
            mod_id,
            veic_placa,
            veic_ano,
            veic_cor,
            veic_combustivel,
            veic_observ,
            veic_situacao
        } = req.body;

        const currentYear = new Date().getFullYear();
        if (parseInt(veic_ano) > currentYear + 1) {
            return res.status(400).json({
                status: 'error',
                message: `O ano do veículo não pode ser maior que ${currentYear + 1}`
            });
        }

        const query = `
      UPDATE veiculos
      SET
        mod_id = $1,
        veic_placa = UPPER($2),
        veic_ano = $3,
        veic_cor = $4,
        veic_combustivel = $5,
        veic_observ = $6,
        veic_situacao = $7
      WHERE veic_id = $8
      RETURNING veic_id;
    `;

        const values = [
            mod_id,
            veic_placa,
            veic_ano,
            veic_cor,
            veic_combustivel,
            veic_observ,
            veic_situacao === true, // garante boolean
            veic_id
        ];

        const { rowCount } = await pool.query(query, values);

        if (!rowCount) {
            return res.status(404).json({ status: 'error', message: 'Veículo não encontrado' });
        }

        res.json({ status: 'success', message: 'Veículo atualizado pelo admin' });
    } catch (error) {
        next(error);
    }
};


// PATCH /vehicles/:veic_id/status
// Ativa ou desativa um veículo 
export const toggleVehicleStatus = async (req, res, next) => {
    try {
        const { veic_id } = req.params;
        const { veic_situacao } = req.body;

        const query = `
      UPDATE veiculos
      SET veic_situacao = $1
      WHERE veic_id = $2;
    `;

        await pool.query(query, [veic_situacao, veic_id]);
        return res.json({
            status: 'success',
            message: `Veículo ${veic_id} ${veic_situacao ? 'ativado' : 'desativado'
                } com sucesso`
        });
    } catch (error) {
        next(error);
    }
};


// DELETE /vehicles/:id
// Remove um veículo
export const deleteVehicle = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
      DELETE FROM veiculos
      WHERE veic_id = $1;
    `;

        await pool.query(query, [id]);

        return res.json({
            status: 'success',
            message: `Veículo ${id} removido com sucesso`
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /vehicles/:id/status
export const updateVehicleStatus = async (req, res, next) => {
    try {
        const { veic_situacao } = req.body;
        const { id } = req.params;

        const query = `
      UPDATE veiculos
      SET veic_situacao = $1
      WHERE veic_id = $2
      RETURNING veic_id, veic_situacao;
    `;

        const result = await pool.query(query, [veic_situacao, id]);

        return res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};