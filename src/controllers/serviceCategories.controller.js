import pool from '../config/db.js';

/**
 * Lista todas as categorias de serviços
 * GET /service-categories
 */
export const listServiceCategories = async (req, res, next) => {
  try {
    const query = `
      SELECT
        cat_serv_id,
        cat_serv_nome
      FROM categorias_servicos
      ORDER BY cat_serv_id;
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
 * Cadastra uma nova categoria de serviço
 * POST /service-categories
 */
export const createServiceCategory = async (req, res, next) => {
  try {
    const { cat_serv_nome } = req.body;

    const query = `
      INSERT INTO categorias_servicos (cat_serv_nome)
      VALUES ($1)
      RETURNING cat_serv_id;
    `;

    const result = await pool.query(query, [cat_serv_nome]);

    return res.status(201).json({
      status: 'success',
      message: 'Categoria de serviço cadastrada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma categoria de serviço
 * PUT /service-categories/:id
 */
export const updateServiceCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cat_serv_nome } = req.body;

    const query = `
      UPDATE categorias_servicos
      SET cat_serv_nome = $1
      WHERE cat_serv_id = $2;
    `;

    await pool.query(query, [cat_serv_nome, id]);

    return res.json({
      status: 'success',
      message: `Categoria ${id} atualizada com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma categoria de serviço
 * DELETE /service-categories/:id
 */
export const deleteServiceCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM categorias_servicos
      WHERE cat_serv_id = $1;
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