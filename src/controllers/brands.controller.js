import pool from '../config/db.js';

/**
 * Lista todas as marcas
 * GET /brands
 */
export const listBrands = async (req, res, next) => {
  try {
    const query = `
      SELECT
        mar_id,
        mar_nome,
        mar_cod,
        mar_icone,
        cat_id
      FROM marcas
      ORDER BY mar_nome ASC; -- Melhor ordenar por nome para listas
    `;

    const result = await pool.query(query);

    return res.json({
      status: 'success',
      data: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista marcas por categoria
 * GET /brands/category/:cat_id
 */
export const listBrandsByCategory = async (req, res, next) => {
  try {
    const { cat_id } = req.params;

    const query = `
      SELECT
        mar_id,
        mar_nome,
        mar_cod,
        mar_icone,
        cat_id
      FROM marcas
      WHERE cat_id = $1
      ORDER BY mar_nome ASC;
    `;

    const result = await pool.query(query, [cat_id]);

    return res.json({
      status: 'success',
      data: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cadastra uma nova marca
 * POST /brands
 */
export const createBrand = async (req, res, next) => {
  try {
    const {
      mar_nome,
      mar_cod,
      mar_icone,
      cat_id
    } = req.body;

    // Validação básica
    if (!mar_nome) {
        return res.status(400).json({ status: 'error', message: 'O nome da marca é obrigatório.' });
    }

    const query = `
      INSERT INTO marcas (
        mar_nome,
        mar_cod,
        mar_icone,
        cat_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      mar_nome,
      mar_cod,
      mar_icone,
      cat_id
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Marca cadastrada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma marca (PATCH Dinâmico)
 * PATCH /brands/:id
 */
export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 1. Verifica se enviou algum dado
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo fornecido para atualização.'
      });
    }

    // 2. Montagem Dinâmica da Query
    const fields = [];
    const values = [];
    let index = 1;

    const allowedFields = ['mar_nome', 'mar_cod', 'mar_icone', 'cat_id'];

    for (const key in updates) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo válido para atualização.'
      });
    }

    values.push(id);

    const query = `
      UPDATE marcas
      SET ${fields.join(', ')}
      WHERE mar_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Marca não encontrada.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Marca atualizada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma marca
 * DELETE /brands/:id
 */
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM marcas
      WHERE mar_id = $1
      RETURNING mar_id;
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Marca não encontrada.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Marca removida com sucesso.'
    });
  } catch (error) {
    // Tratamento de erro de chave estrangeira (Ex: tentar apagar Ford se existirem carros Ka ou Fiesta)
    if (error.code === '23503') {
        return res.status(409).json({
            status: 'error',
            message: 'Não é possível excluir esta marca pois existem modelos vinculados a ela.'
        });
    }
    next(error);
  }
};