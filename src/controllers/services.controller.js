import pool from '../config/db.js';

/* =========================================================
   GET /services
/* =========================================================
   GET /services
========================================================= */
export const listServices = async (req, res, next) => {
  try {
    const {
      search,
      page = 1,
      limit = 1000,
      status = 'active',
      orderBy = 'cat_serv_nome',
      orderDirection = 'ASC',
      vehicleType // <--- 1. FALTAVA PEGAR ISSO AQUI
    } = req.query;

    console.log("FILTROS RECEBIDOS:", req.query);

    const offset = (page - 1) * limit;

    // --- LÓGICA DE ORDENAÇÃO ---
    const sortableColumns = ['serv_id', 'serv_nome', 'stv_preco', 'stv_duracao', 'serv_situacao', 'cat_serv_nome'];
    const safeColumn = sortableColumns.includes(orderBy) ? orderBy : 'cat_serv_nome';
    const safeDirection = orderDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let orderByClause = '';

    if (safeColumn === 'cat_serv_nome') {
      orderByClause = `ORDER BY cs.cat_serv_nome ${safeDirection}, s.serv_nome ASC`;
    } else {
      orderByClause = `ORDER BY s.${safeColumn} ${safeDirection}`;
    }

    // --- MONTAGEM DA QUERY PRINCIPAL ---
    let queryText = `
          SELECT s.serv_id, 
                 s.cat_serv_id, 
                 cs.cat_serv_nome, 
                 s.serv_nome,
                 s.serv_descricao,
                 s.serv_situacao,
                 stv.stv_preco,
                 stv.stv_duracao,
                 tvs.tps_nome
            FROM servicos              AS s
       LEFT JOIN categorias_servicos   AS cs  ON s.cat_serv_id = cs.cat_serv_id
       LEFT JOIN servicos_tipo_veiculo AS stv ON s.serv_id     = stv.serv_id
       LEFT JOIN tipo_veiculo_servico  AS tvs ON stv.tps_id    = tvs.tps_id
    `;

    // --- 2. FALTAVA OS JOINS NA QUERY DE CONTAGEM ---
    // Se não tiver os joins aqui, quando tentarmos filtrar "WHERE tvs.tps_id = ...", o count vai dar erro de SQL
    let countQuery = `
         SELECT COUNT(*) AS total 
           FROM servicos AS s
      LEFT JOIN categorias_servicos   AS cs  ON s.cat_serv_id = cs.cat_serv_id
      LEFT JOIN servicos_tipo_veiculo AS stv ON s.serv_id     = stv.serv_id
      LEFT JOIN tipo_veiculo_servico  AS tvs ON stv.tps_id    = tvs.tps_id
    `;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filtro de Busca
    if (search) {
      conditions.push(`(s.serv_nome ILIKE $${paramIndex} OR s.serv_descricao ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Filtro de Status
    if (status && status !== 'all') {
      const statusBool = status === 'active';
      conditions.push(`s.serv_situacao = $${paramIndex}`);
      values.push(statusBool);
      paramIndex++;
    }

    // --- 3. FALTAVA A LÓGICA DO FILTRO DE VEÍCULO ---
    if (vehicleType && vehicleType !== 'all') {
      // Filtra pela coluna tps_id da tabela tvs (tipo_veiculo_servico)
      conditions.push(`tvs.tps_id = $${paramIndex}`);
      values.push(vehicleType);
      paramIndex++;
    }

    // Aplica WHERE (Serve para a query principal e para o count)
    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(' AND ');
      queryText += whereClause;
      countQuery += whereClause;
    }

    // Aplica ORDER BY e Paginação (Apenas na query principal)
    queryText += ` ${orderByClause} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    // Executa Principal
    const result = await pool.query(queryText, values);

    // Executa Count (remove limit e offset dos values)
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
/* =========================================================
   GET /services/:serv_id
========================================================= */
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
                json_agg(
                  json_build_object(
                    'tps_id', tvs.tps_id,
                    'preco', stv.stv_preco,
                    'duracao', stv.stv_duracao
                  )
                ) AS precos
           FROM servicos AS s
      LEFT JOIN servicos_tipo_veiculo AS stv ON stv.serv_id = s.serv_id
      LEFT JOIN tipo_veiculo_servico  AS tvs ON tvs.tps_id  = stv.tps_id
          WHERE s.serv_id = $1
       GROUP BY s.serv_id
      `,
      [serv_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ status: 'error', message: 'Serviço não encontrado' });
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   POST /services
========================================================= */
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
        [serv_id, p.tps_id, p.preco, p.duracao] // Use p.tps_id aqui
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

/* =========================================================
   PATCH /services/:serv_id
   UPDATE COMPLETO (SERVIÇO + PREÇOS)
========================================================= */
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
        [serv_id, p.cat_veic_id, p.preco, p.duracao]
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

/* =========================================================
   PATCH /services/:serv_id/status
========================================================= */
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

/* =========================================================
   DELETE /services/:serv_id
========================================================= */
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
