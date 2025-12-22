import pool from '../config/db.js';

/**
 * Lista todas as indisponibilidades cadastradas
 * GET /unavailability
 */
export const listUnavailability = async (req, res, next) => {
  try {
    const query = `
      SELECT
        indisp_id,
        indisp_data,
        indisp_situacao
      FROM indisponibilidade
      ORDER BY indisp_id;
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
 * Cadastra uma nova indisponibilidade
 * POST /unavailability
 */
export const createUnavailability = async (req, res, next) => {
  try {
    const { indisp_data, indisp_situacao } = req.body;

    const query = `
      INSERT INTO indisponibilidade (
        indisp_data,
        indisp_situacao
      )
      VALUES ($1, $2)
      RETURNING indisp_id;
    `;

    const values = [indisp_data, indisp_situacao];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Indisponibilidade cadastrada com sucesso.',
      id: result.rows[0].indisp_id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Edita a data de uma indisponibilidade
 * PATCH /unavailability/:indisp_id
 */
export const updateUnavailability = async (req, res, next) => {
  try {
    const { indisp_id } = req.params;
    const { indisp_data } = req.body;

    const query = `
      UPDATE indisponibilidade
         SET indisp_data = $1
       WHERE indisp_id = $2;
    `;

    const result = await pool.query(query, [indisp_data, indisp_id]);

    return res.json({
      status: 'success',
      message: `Indisponibilidade ${indisp_id} atualizada com sucesso.`,
      rowsAffected: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ativa ou desativa uma indisponibilidade
 * PATCH /unavailability/status/:indisp_id
 */
export const toggleUnavailabilityStatus = async (req, res, next) => {
  try {
    const { indisp_id } = req.params;
    const { indisp_situacao } = req.body;

    const query = `
      UPDATE indisponibilidade
         SET indisp_situacao = $1
       WHERE indisp_id = $2;
    `;

    const result = await pool.query(query, [indisp_situacao, indisp_id]);

    return res.json({
      status: 'success',
      message: `Indisponibilidade ${
        indisp_situacao ? 'ativada' : 'desativada'
      } com sucesso.`,
      rowsAffected: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma indisponibilidade
 * DELETE /unavailability/:indisp_id
 */
export const deleteUnavailability = async (req, res, next) => {
  try {
    const { indisp_id } = req.params;

    const query = `
      DELETE FROM indisponibilidade
      WHERE indisp_id = $1;
    `;

    const result = await pool.query(query, [indisp_id]);

    return res.json({
      status: 'success',
      message: `Indisponibilidade ${indisp_id} removida com sucesso.`,
      rowsAffected: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};