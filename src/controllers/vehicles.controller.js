import pool from '../config/db.js';

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

    // Ordenação
    const { orderBy = 'veic_id', orderDirection = 'DESC' } = req.query;

    const sortMap = {
        'veic_id': 'v.veic_id',
        'modelo': 'mo.mod_nome',
        'marca': 'm.mar_nome',
        'veic_placa': 'v.veic_placa',
        'veic_situacao': 'v.veic_situacao'
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
         SELECT v.veic_id,
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
      LEFT JOIN modelos         AS mo ON v.mod_id  = mo.mod_id
      LEFT JOIN marcas          AS m  ON mo.mar_id = m.mar_id
      LEFT JOIN veiculo_usuario AS vu ON v.veic_id = vu.veic_id 
                                      AND vu.data_final IS NULL
      LEFT JOIN usuarios        AS u  ON vu.usu_id = u.usu_id
      ${whereClause}
       GROUP BY v.veic_id, 
                mo.mod_nome, 
                m.mar_nome, 
                v.veic_placa,
                v.veic_ano, 
                v.veic_cor, 
                v.veic_combustivel, 
                v.veic_observ, 
                v.veic_situacao
      ORDER BY ${safeOrderBy} ${safeOrderDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(queryText, values);

    // Query de Contagem
    const countQuery = `
         SELECT COUNT(DISTINCT v.veic_id) AS total
           FROM veiculos        AS v
      LEFT JOIN modelos         AS mo ON v.mod_id  = mo.mod_id
      LEFT JOIN marcas          AS m ON mo.mar_id  = m.mar_id
      LEFT JOIN veiculo_usuario AS vu ON v.veic_id = vu.veic_id 
                                      AND vu.data_final IS NULL
      LEFT JOIN usuarios        AS u ON vu.usu_id  = u.usu_id
      ${whereClause}
    `;

    const countValues = values.slice(0, paramIndex - 1);
    const countResult = await pool.query(countQuery, countValues);

    const totalItems = Number(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: 'success',
      data: result.rows,
      meta: { totalItems, totalPages, currentPage: page, itemsPerPage: limit },
    });

  } catch (error) {
    next(error);
  }
};


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
         GROUP BY v.veic_id, c.cat_id, mo.mod_id, mo.mod_nome, m.mar_id, m.mar_nome, c.cat_nome;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Veículo não encontrado' });
        }

        return res.json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};


export const createVehicle = async (req, res, next) => {
    try {
        const {
            mod_id, veic_placa, veic_ano, veic_cor, 
            veic_combustivel, veic_observ, veic_situacao
        } = req.body;

        if (!mod_id || !veic_placa || !veic_ano) {
             return res.status(400).json({ status: 'error', message: 'Modelo, Placa e Ano são obrigatórios.' });
        }

        const currentYear = new Date().getFullYear();
        if (parseInt(veic_ano) > currentYear + 1) {
            return res.status(400).json({ status: 'error', message: `O ano do veículo não pode ser maior que ${currentYear + 1}` });
        }

        // Verifica duplicidade de placa
        const checkQuery = `SELECT veic_id FROM veiculos WHERE veic_placa = $1 LIMIT 1;`;
        const checkResult = await pool.query(checkQuery, [veic_placa.toUpperCase()]);

        if (checkResult.rows.length > 0) {
            return res.status(409).json({ status: 'error', message: 'Placa já cadastrada no sistema.' });
        }

        const insertQuery = `
        INSERT INTO veiculos (
            mod_id, veic_placa, veic_ano, veic_cor, veic_combustivel, veic_observ, veic_situacao
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `;

        const values = [
            mod_id, veic_placa.toUpperCase(), veic_ano, veic_cor, 
            veic_combustivel, veic_observ, veic_situacao ?? true
        ];

        const result = await pool.query(insertQuery, values);

        return res.status(201).json({ status: 'success', message: 'Veículo cadastrado com sucesso', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};



const updateVehicleDynamic = async (veic_id, updates, allowedFields) => {
    // 1. Validações Específicas antes de montar a query
    if (updates.veic_ano) {
        const currentYear = new Date().getFullYear();
        if (parseInt(updates.veic_ano) > currentYear + 1) {
             throw { status: 400, message: `O ano do veículo não pode ser maior que ${currentYear + 1}` };
        }
    }

    if (updates.veic_placa) {
        updates.veic_placa = updates.veic_placa.toUpperCase();
        // Verifica se a nova placa já existe em OUTRO veículo
        const check = await pool.query(
            `SELECT veic_id FROM veiculos WHERE veic_placa = $1 AND veic_id != $2`, 
            [updates.veic_placa, veic_id]
        );
        if (check.rowCount > 0) {
            throw { status: 409, message: 'Esta placa já pertence a outro veículo.' };
        }
    }

    // 2. Montagem Dinâmica
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = $${index}`);
            values.push(updates[key]);
            index++;
        }
    }

    if (fields.length === 0) {
        throw { status: 400, message: 'Nenhum campo válido para atualização.' };
    }

    values.push(veic_id);

    const query = `
        UPDATE veiculos
           SET ${fields.join(', ')}
         WHERE veic_id = $${index}
        RETURNING *;
    `;

    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
        throw { status: 404, message: 'Veículo não encontrado.' };
    }

    return result.rows[0];
};


export const updateVehicleByUser = async (req, res, next) => {
    try {
        const { veic_id } = req.params;
        const updates = req.body;
        
        // Campos permitidos para o usuário comum
        const allowedFields = ['mod_id', 'veic_placa', 'veic_ano', 'veic_cor', 'veic_combustivel', 'veic_observ'];

        const updatedVehicle = await updateVehicleDynamic(veic_id, updates, allowedFields);
        
        return res.json({ status: 'success', message: 'Veículo atualizado.', data: updatedVehicle });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ status: 'error', message: error.message });
        next(error);
    }
};


export const updateVehicleByAdmin = async (req, res, next) => {
    try {
        const { veic_id } = req.params;
        const updates = req.body;
        
        // Admin pode alterar tudo
        const allowedFields = ['mod_id', 'veic_placa', 'veic_ano', 'veic_cor', 'veic_combustivel', 'veic_observ', 'veic_situacao'];

        const updatedVehicle = await updateVehicleDynamic(veic_id, updates, allowedFields);

        return res.json({ status: 'success', message: 'Veículo atualizado (Admin).', data: updatedVehicle });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ status: 'error', message: error.message });
        next(error);
    }
};


export const toggleVehicleStatus = async (req, res, next) => {
    try {
        const { veic_id } = req.params;
        const { veic_situacao } = req.body;

        if (veic_situacao === undefined) {
             return res.status(400).json({ status: 'error', message: 'O campo veic_situacao é obrigatório.' });
        }

        const query = `
            UPDATE veiculos
               SET veic_situacao = $1
             WHERE veic_id = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [veic_situacao, veic_id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ status: 'error', message: 'Veículo não encontrado.' });
        }

        return res.json({
            status: 'success',
            message: `Veículo ${veic_situacao ? 'ativado' : 'desativado'} com sucesso`,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteVehicle = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE 
              FROM veiculos
             WHERE veic_id = $1
            RETURNING veic_id;
        `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ status: 'error', message: 'Veículo não encontrado.' });
        }

        return res.json({
            status: 'success',
            message: 'Veículo removido com sucesso'
        });
    } catch (error) {
        // Erro de Chave Estrangeira (Se tiver histórico ou agendamentos)
        if (error.code === '23503') {
             return res.status(409).json({ 
                 status: 'error', 
                 message: 'Não é possível excluir este veículo pois ele possui histórico de proprietários ou agendamentos.' 
             });
        }
        next(error);
    }
};

