import pool from '../config/db.js';

/**
 * Lista todas as situações possíveis da agenda de serviços
 * GET /agenda-service-status
 */
export const listAgendaServiceStatus = async (req, res, next) => {
  try {
    const query = `
      SELECT
        agend_serv_situ_id,
        agend_serv_situ_nome
      FROM agenda_servicos_situacao
      ORDER BY agend_serv_situ_id;
    `;

    const result = await pool.query(query);

    return res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cadastra uma nova situação para a agenda de serviços
 * POST /agenda-service-status
 */
export const createAgendaServiceStatus = async (req, res, next) => {
  try {
    const { agend_serv_situ_nome } = req.body;

    const query = `
      INSERT INTO agenda_servicos_situacao (agend_serv_situ_nome)
      VALUES ($1)
      RETURNING agend_serv_situ_id;
    `;

    const values = [agend_serv_situ_nome];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Situação cadastrada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma situação da agenda de serviços
 * PUT /agenda-service-status/:id
 */
export const updateAgendaServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agend_serv_situ_nome } = req.body;

    const query = `
      UPDATE agenda_servicos_situacao
      SET agend_serv_situ_nome = $1
      WHERE agend_serv_situ_id = $2;
    `;

    await pool.query(query, [agend_serv_situ_nome, id]);

    return res.json({
      status: 'success',
      message: `Situação ${id} atualizada com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma situação da agenda de serviços
 * DELETE /agenda-service-status/:id
 */
export const deleteAgendaServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM agenda_servicos_situacao
      WHERE agend_serv_situ_id = $1;
    `;

    await pool.query(query, [id]);

    return res.json({
      status: 'success',
      message: `Situação ${id} removida com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};