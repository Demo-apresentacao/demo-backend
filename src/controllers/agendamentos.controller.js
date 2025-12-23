import pool from '../config/db.js';

/**
 * Lista todos os agendamentos
 * GET /agendamentos
 */
export const listAgendamentos = async (req, res, next) => {
  try {
    const query = `
      SELECT
        agend_id,
        veic_usu_id,
        agend_data,
        agend_horario,
        agend_situacao,
        agend_serv_situ_id,
        agend_observ,
        serv_id
      FROM agendamentos
      ORDER BY agend_data, agend_horario;
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
 * Cria um novo agendamento
 * POST /agendamentos
 */
export const createAgendamento = async (req, res, next) => {
  try {
    const {
      veic_usu_id,
      agend_data,
      agend_horario,
      agend_situacao,
      agend_observ,
      serv_id,
      agend_serv_situ_id
    } = req.body;

    // Validação básica
    if (
      !veic_usu_id ||
      !agend_data ||
      !agend_horario ||
      agend_situacao === undefined ||
      !serv_id ||
      !agend_serv_situ_id
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Campos obrigatórios não informados.'
      });
    }

    const query = `
      INSERT INTO agendamentos (
        veic_usu_id,
        agend_data,
        agend_horario,
        agend_situacao,
        agend_observ,
        serv_id,
        agend_serv_situ_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING agend_id;
    `;

    const values = [
      veic_usu_id,
      agend_data,
      agend_horario,
      agend_situacao,
      agend_observ ?? null,
      serv_id,
      agend_serv_situ_id
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Agendamento criado com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um agendamento
 * PUT /agendamentos/:id
 */
export const updateAgendamento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      veic_usu_id,
      agend_data,
      agend_horario,
      agend_situacao,
      agend_observ,
      serv_id,
      agend_serv_situ_id
    } = req.body;

    const query = `
      UPDATE agendamentos
      SET
        veic_usu_id = $1,
        agend_data = $2,
        agend_horario = $3,
        agend_situacao = $4,
        agend_observ = $5,
        serv_id = $6,
        agend_serv_situ_id = $7
      WHERE agend_id = $8;
    `;

    await pool.query(query, [
      veic_usu_id,
      agend_data,
      agend_horario,
      agend_situacao,
      agend_observ ?? null,
      serv_id,
      agend_serv_situ_id,
      id
    ]);

    return res.json({
      status: 'success',
      message: `Agendamento ${id} atualizado com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza somente a situação do agendamento
 * PATCH /agendamentos/:id/status
 */
export const updateAgendamentoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agend_serv_situ_id } = req.body;

    const query = `
      UPDATE agendamentos
      SET agend_serv_situ_id = $1
      WHERE agend_id = $2;
    `;

    await pool.query(query, [agend_serv_situ_id, id]);

    return res.json({
      status: 'success',
      message: 'Situação do agendamento atualizada.'
    });
  } catch (error) {
    next(error);
  }
};