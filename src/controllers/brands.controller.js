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
      ORDER BY mar_id;
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
      ORDER BY mar_id;
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

    const query = `
      INSERT INTO marcas (
        mar_nome,
        mar_cod,
        mar_icone,
        cat_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING mar_id;
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
 * Atualiza uma marca
 * PUT /brands/:id
 */
export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      mar_nome,
      mar_cod,
      mar_icone,
      cat_id
    } = req.body;

    const query = `
      UPDATE marcas
      SET
        mar_nome = $1,
        mar_cod = $2,
        mar_icone = $3,
        cat_id = $4
      WHERE mar_id = $5;
    `;

    await pool.query(query, [
      mar_nome,
      mar_cod,
      mar_icone,
      cat_id,
      id
    ]);

    return res.json({
      status: 'success',
      message: `Marca ${id} atualizada com sucesso.`
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
      WHERE mar_id = $1;
    `;

    await pool.query(query, [id]);

    return res.json({
      status: 'success',
      message: `Marca ${id} removida com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};