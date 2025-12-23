import pool from '../config/db.js';

/**
 * Lista todas as categorias
 * GET /categories
 */
export const listCategories = async (req, res, next) => {
  try {
    const query = `
      SELECT
        cat_id,
        cat_nome,
        cat_icone
      FROM categorias
      ORDER BY cat_id;
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
 * Cadastra uma nova categoria
 * POST /categories
 */
export const createCategory = async (req, res, next) => {
  try {
    const { cat_nome, cat_icone } = req.body;

    const query = `
      INSERT INTO categorias (cat_nome, cat_icone)
      VALUES ($1, $2)
      RETURNING cat_id;
    `;

    const values = [cat_nome, cat_icone];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Categoria cadastrada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma categoria
 * PUT /categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cat_nome, cat_icone } = req.body;

    const query = `
      UPDATE categorias
      SET
        cat_nome = $1,
        cat_icone = $2
      WHERE cat_id = $3;
    `;

    await pool.query(query, [cat_nome, cat_icone, id]);

    return res.json({
      status: 'success',
      message: `Categoria ${id} atualizada com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma categoria
 * DELETE /categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM categorias
      WHERE cat_id = $1;
    `;

    await pool.query(query, [id]);

    return res.json({
      status: 'success',
      message: `Categoria ${id} removida com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};