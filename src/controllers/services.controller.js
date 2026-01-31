import pool from '../config/db.js';

export const listServices = async (req, res, next) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      status = 'all',
      orderBy = 'cat_serv_nome',
      orderDirection = 'ASC',
      vehicleType = 'all',
      category = 'all'
    } = req.query;

    const offset = (page - 1) * limit;

    const sortableColumns = [
      'serv_id',
      'serv_nome',
      'cat_serv_nome',
      'serv_situacao'
    ];

    const safeColumn = sortableColumns.includes(orderBy)
      ? orderBy
      : 'cat_serv_nome';

    const safeDirection =
      orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const orderByClause =
      safeColumn === 'cat_serv_nome'
        ? `ORDER BY cs.cat_serv_nome ${safeDirection}, s.serv_nome ASC`
        : `ORDER BY s.${safeColumn} ${safeDirection}`;

    const baseQuery = `
           FROM servicos AS s
      LEFT JOIN categorias_servicos   AS cs  ON cs.cat_serv_id = s.cat_serv_id
      LEFT JOIN servicos_tipo_veiculo AS stv ON stv.serv_id    = s.serv_id
      LEFT JOIN tipo_veiculo_servico  AS tvs ON tvs.tps_id     = stv.tps_id
    `;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`
        (s.serv_nome ILIKE $${paramIndex}
         OR s.serv_descricao ILIKE $${paramIndex})
      `);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (status !== 'all') {
      conditions.push(`s.serv_situacao = $${paramIndex}`);
      values.push(status === 'active');
      paramIndex++;
    }

    if (category !== 'all') {
      conditions.push(`s.cat_serv_id = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }

    if (vehicleType !== 'all') {
      conditions.push(`tvs.tps_id = $${paramIndex}`);
      values.push(vehicleType);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const dataQuery = `
      SELECT
        s.serv_id,
        s.serv_nome,
        s.serv_descricao,
        s.serv_situacao,
        s.cat_serv_id,
        cs.cat_serv_nome,

        COALESCE(
          json_agg(
            json_build_object(
              'tps_id', tvs.tps_id,
              'tps_nome', tvs.tps_nome,
              'preco', stv.stv_preco,
              'duracao', stv.stv_duracao
            )
          ) FILTER (WHERE tvs.tps_id IS NOT NULL),
          '[]'
        ) AS categorias

      ${baseQuery}
      ${whereClause}

      GROUP BY
        s.serv_id,
        s.serv_nome,
        s.serv_descricao,
        s.serv_situacao,
        s.cat_serv_id,
        cs.cat_serv_nome

      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataValues = [...values, limit, offset];

    const countQuery = `
      SELECT COUNT(DISTINCT s.serv_id) AS total
      ${baseQuery}
      ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, dataValues),
      pool.query(countQuery, values)
    ]);

    const totalItems = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    return res.json({
      status: 'success',
      data: dataResult.rows,
      meta: {
        totalItems,
        totalPages,
        currentPage: Number(page),
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};


export const getServiceById = async (req, res, next) => {
  try {
    const { serv_id } = req.params;

    const result = await pool.query(
      `
         SELECT s.serv_id,
                s.serv_nome,
                s.serv_descricao,
                s.cat_serv_id,
                s.serv_situacao,
        
                COALESCE(
                  json_agg(
                    json_build_object(
                      'tps_id', tvs.tps_id,
                      'tps_nome', tvs.tps_nome,
                      'preco', stv.stv_preco,
                      'duracao', stv.stv_duracao
                   )
                  ) FILTER (WHERE tvs.tps_id IS NOT NULL), 
                    '[]'
                ) AS precos
           FROM servicos AS s
      LEFT JOIN servicos_tipo_veiculo AS stv ON stv.serv_id = s.serv_id
      LEFT JOIN tipo_veiculo_servico  AS tvs ON tvs.tps_id  = stv.tps_id
          WHERE s.serv_id = $1
       GROUP BY s.serv_id,
                s.serv_nome, 
                s.serv_descricao, 
                s.cat_serv_id, 
                s.serv_situacao
      `,
      [serv_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Serviço não encontrado'
      });
    }

    // Retorna o objeto formatado
    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Erro em getServiceById:", error);
    next(error);
  }
};


export const createService = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { serv_nome, serv_descricao, cat_serv_id, prices } = req.body;

    if (!serv_nome || !cat_serv_id || !Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Serviço deve possuir ao menos um tipo de veículo com preço'
      });
    }

    await client.query('BEGIN');

    const service = await client.query(
      `
      INSERT INTO servicos (serv_nome, serv_descricao, cat_serv_id, serv_situacao)
      VALUES ($1, $2, $3, true)
      RETURNING serv_id
      `,
      [serv_nome, serv_descricao, cat_serv_id]
    );

    const serv_id = service.rows[0].serv_id;

    for (const p of prices) {
      await client.query(
        `INSERT INTO servicos_tipo_veiculo (serv_id, tps_id, stv_preco, stv_duracao)
     VALUES ($1, $2, $3, $4)`,
        [serv_id, p.tps_id, p.preco, p.duracao] 
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ success: true, message: 'Serviço criado com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};



export const updateService = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { serv_id } = req.params;
    const { serv_nome, serv_descricao, cat_serv_id, prices, serv_situacao } = req.body;

    if (!Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'O serviço deve possuir ao menos um tipo de veículo com preço'
      });
    }

    await client.query('BEGIN');

    await client.query(
      `
      UPDATE servicos
         SET serv_nome = $1,
             serv_descricao = $2,
             cat_serv_id = $3,
             serv_situacao = COALESCE($4, serv_situacao)
       WHERE serv_id = $5
      `,
      [serv_nome, serv_descricao, cat_serv_id, serv_situacao, serv_id]
    );

    // Remove preços antigos
    await client.query(
      `DELETE 
         FROM servicos_tipo_veiculo 
        WHERE serv_id = $1`,
      [serv_id]
    );

    // Insere novos preços
    for (const p of prices) {
      await client.query(
        `
        INSERT INTO servicos_tipo_veiculo (serv_id, tps_id, stv_preco, stv_duracao)
        VALUES ($1, $2, $3, $4)
        `,
        [
          serv_id,
          p.tps_id,
          p.preco || 0,             
          p.duracao || '00:00:00'  
        ]
      );
    }

    await client.query('COMMIT');

    res.json({ status: 'success', message: 'Serviço atualizado com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};


export const toggleServiceStatus = async (req, res, next) => {
  try {
    const { serv_id } = req.params;
    const { serv_situacao } = req.body;

    const result = await pool.query(
      `UPDATE servicos 
          SET serv_situacao = $1 
        WHERE serv_id = $2`,
      [serv_situacao, serv_id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ status: 'error', message: 'Serviço não encontrado' });
    }

    res.json({ status: 'success', message: 'Status atualizado' });
  } catch (error) {
    next(error);
  }
};


export const getServicesByVehicle = async (req, res, next) => {
    try {
        const { veic_usu_id } = req.params;

        if (!veic_usu_id) {
            return res.status(400).json({ status: 'error', message: 'ID do veículo não informado.' });
        }

        const query = `
               SELECT s.serv_id, 
                      s.serv_nome, 
                      s.serv_descricao,
                      stv.stv_preco as serv_preco, 
                      stv.stv_duracao,
                      cs.cat_serv_nome,
                      tvs.tps_nome as categoria_cobranca 
                 FROM veiculo_usuario       AS vu
                 JOIN veiculos              AS v   ON vu.veic_id    = v.veic_id
                 JOIN modelos               AS m   ON v.mod_id      = m.mod_id
                 JOIN marcas                AS ma  ON m.mar_id      = ma.mar_id
                 JOIN categorias            AS c   ON ma.cat_id     = c.cat_id
                 JOIN servicos_tipo_veiculo AS stv ON c.tps_id      = stv.tps_id 
                 JOIN tipo_veiculo_servico  AS tvs ON stv.tps_id    = tvs.tps_id
                 JOIN servicos              AS s   ON stv.serv_id   = s.serv_id
            LEFT JOIN categorias_servicos   AS cs  ON s.cat_serv_id = cs.cat_serv_id
                WHERE vu.veic_usu_id = $1
                  AND s.serv_situacao = true
                  AND stv.stv_situacao = true
             ORDER BY cs.cat_serv_nome ASC, 
                      s.serv_nome ASC;
        `;

        const result = await pool.query(query, [veic_usu_id]);

        return res.json({
            status: 'success',
            data: result.rows
        });

    } catch (error) {
        console.error("Erro SQL Detalhado:", error);
        next(error);
    }
};


export const deleteService = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { serv_id } = req.params;

    await client.query('BEGIN');

    await client.query(`
      DELETE 
        FROM servicos_tipo_veiculo 
       WHERE serv_id = $1`, [serv_id]);

    await client.query(`
      DELETE 
        FROM servicos 
       WHERE serv_id = $1`, [serv_id]);

    await client.query('COMMIT');

    res.json({ status: 'success', message: 'Serviço removido com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};
