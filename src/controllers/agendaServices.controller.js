import pool from '../config/db.js';

/**
 * Lista todos os serviços vinculados às agendas
 * GET /agenda-services
 */
export const listAgendaServices = async (req, res, next) => {
  try {
    const query = `
      SELECT
        agend_serv_id,
        agend_id,
        serv_id,
        agend_serv_situ_id
      FROM agenda_servicos
      ORDER BY agend_serv_id;
    `;

    const result = await pool.query(query);

    return res.json({
      status: 'success',
      data: result.rows,
      nItems: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cadastra um serviço em uma agenda
 * POST /agenda-services
 */
export const createAgendaService = async (req, res, next) => {
  try {
    const { agend_id, serv_id, agend_serv_situ_id } = req.body;

    const query = `
      INSERT INTO agenda_servicos (
        agend_id,
        serv_id,
        agend_serv_situ_id
      )
      VALUES ($1, $2, $3)
      RETURNING agend_serv_id;
    `;

    const values = [agend_id, serv_id, agend_serv_situ_id];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Serviço agendado cadastrado com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um serviço agendado
 * PATCH /agenda-services/:agend_serv_id
 */
export const updateAgendaService = async (req, res, next) => {
  try {
    const { agend_serv_id } = req.params;
    const { agend_id, serv_id, agend_serv_situ_id } = req.body;

    const query = `
      UPDATE agenda_servicos
         SET agend_id = $1,
             serv_id = $2,
             agend_serv_situ_id = $3
       WHERE agend_serv_id = $4
       RETURNING *;
    `;

    const values = [
      agend_id,
      serv_id,
      agend_serv_situ_id,
      agend_serv_id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Serviço agendado não encontrado.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Serviço agendado atualizado com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Exclui um serviço agendado
 * DELETE /agenda-services/:agend_serv_id
 */
export const deleteAgendaService = async (req, res, next) => {
  try {
    const { agend_serv_id } = req.params;

    const query = `
      DELETE FROM agenda_servicos
       WHERE agend_serv_id = $1
       RETURNING agend_serv_id;
    `;

    const result = await pool.query(query, [agend_serv_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Serviço agendado não encontrado.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Serviço agendado excluído com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};