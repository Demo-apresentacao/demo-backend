import pool from '../config/db.js';

// GET /vehicles
// Lista todos os veículos
export const listVehicles = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const values = [];

        // 1. Definir as colunas do SELECT (Campos)
        const selectFields = `
            SELECT v.veic_id,
                   mo.mod_nome AS modelo,
                   v.veic_placa,
                   v.veic_ano,
                   v.veic_cor,
                   v.veic_combustivel,
                   v.veic_observ,
                   v.veic_situacao,
                   m.mar_nome AS marca,
                   STRING_AGG(DISTINCT CASE WHEN vu.data_final IS NULL THEN u.usu_nome ELSE NULL END, ', ') AS proprietarios,
                   COUNT(DISTINCT CASE WHEN vu.data_final IS NULL THEN vu.usu_id ELSE NULL END) AS num_proprietarios
        `;

        // 2. Definir os JOINS (Necessário tanto para a Lista Principal quanto para a Contagem, pois a busca usa colunas das tabelas unidas)
        const joinClause = `
            FROM veiculos AS v
            JOIN modelos AS mo ON v.mod_id = mo.mod_id
            JOIN marcas AS m ON mo.mar_id = m.mar_id
            LEFT JOIN veiculo_usuario AS vu ON v.veic_id = vu.veic_id
            LEFT JOIN usuarios AS u ON vu.usu_id = u.usu_id
        `;

        // 3. Definir o GROUP BY (Apenas para a lista principal)
        const groupByClause = `
            GROUP BY v.veic_id,
                     mo.mod_nome,
                     m.mar_nome,
                     v.veic_placa,
                     v.veic_ano,
                     v.veic_cor,
                     v.veic_combustivel,
                     v.veic_observ,
                     v.veic_situacao
        `;

        // 4. Construir o WHERE dinamicamente
        let whereClause = '';
        if (search) {
            whereClause = ` WHERE v.veic_placa ILIKE $1 OR mo.mod_nome ILIKE $1 OR m.mar_nome ILIKE $1 OR u.usu_nome ILIKE $1`;
            values.push(`%${search}%`);
        }

        // 5. Montar a Query PRINCIPAL
        // Ordem Obrigatória do SQL: SELECT -> JOINS -> WHERE -> GROUP BY -> ORDER BY -> LIMIT/OFFSET
        let queryText = `${selectFields} ${joinClause} ${whereClause} ${groupByClause} ORDER BY v.veic_id DESC`;

        // Lógica de parâmetros para Limit/Offset
        if (search) {
            queryText += ` LIMIT $2 OFFSET $3`;
        } else {
            queryText += ` LIMIT $1 OFFSET $2`;
        }
        values.push(limit, offset);

        // 6. Montar a Query de CONTAGEM (Count)
        // Devemos usar COUNT(DISTINCT v.veic_id) para evitar duplicatas geradas pelos joins
        // Devemos incluir os 'joinClause' porque o WHERE usa tabelas como 'modelos' e 'usuarios'
        let countQueryText = `SELECT COUNT(DISTINCT v.veic_id) AS total ${joinClause} ${whereClause}`;
        const countValues = search ? [`%${search}%`] : [];

        // Executar Queries
        const result = await pool.query(queryText, values);
        const countResult = await pool.query(countQueryText, countValues);

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