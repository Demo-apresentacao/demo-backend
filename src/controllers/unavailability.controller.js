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
      ORDER BY indisp_data ASC; -- Ordenar por data faz mais sentido para agenda
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
    const { indisp_data, indisp_situacao = true } = req.body;

    if (!indisp_data) {
        return res.status(400).json({ status: 'error', message: 'A data da indisponibilidade é obrigatória.' });
    }

    const query = `
      INSERT INTO indisponibilidade (
        indisp_data,
        indisp_situacao
      )
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [indisp_data, indisp_situacao];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Indisponibilidade cadastrada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Edita uma indisponibilidade (PATCH Dinâmico)
 * PATCH /unavailability/:indisp_id
 */
export const updateUnavailability = async (req, res, next) => {
  try {
    const { indisp_id } = req.params;
    const updates = req.body;

    // 1. Verifica se enviou algum dado
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ status: 'error', message: 'Nenhum campo fornecido para atualização.' });
    }

    // 2. Montagem Dinâmica da Query
    const fields = [];
    const values = [];
    let index = 1;

    const allowedFields = ['indisp_data', 'indisp_situacao'];

    for (const key in updates) {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = $${index}`);
            values.push(updates[key]);
            index++;
        }
    }

    if (fields.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Nenhum campo válido para atualização.' });
    }

    values.push(indisp_id);

    const query = `
      UPDATE indisponibilidade
      SET ${fields.join(', ')}
      WHERE indisp_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: "Indisponibilidade não encontrada" });
    }

    return res.json({
      status: 'success',
      message: `Indisponibilidade atualizada com sucesso.`,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ativa ou desativa uma indisponibilidade (Atalho)
 * PATCH /unavailability/status/:indisp_id
 */
export const toggleUnavailabilityStatus = async (req, res, next) => {
  try {
    const { indisp_id } = req.params;
    const { indisp_situacao } = req.body;

    if (indisp_situacao === undefined) {
        return res.status(400).json({ status: 'error', message: "O campo indisp_situacao é obrigatório." });
    }

    const query = `
      UPDATE indisponibilidade
      SET indisp_situacao = $1
      WHERE indisp_id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [indisp_situacao, indisp_id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: "Indisponibilidade não encontrada" });
    }

    return res.json({
      status: 'success',
      message: `Indisponibilidade ${indisp_situacao ? 'ativada' : 'desativada'} com sucesso.`,
      data: result.rows[0]
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
      WHERE indisp_id = $1
      RETURNING indisp_id;
    `;

    const result = await pool.query(query, [indisp_id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: "Indisponibilidade não encontrada" });
    }

    return res.json({
      status: 'success',
      message: `Indisponibilidade removida com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};