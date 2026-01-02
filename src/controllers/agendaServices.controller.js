import pool from '../config/db.js';

/**
 * Lista todos os serviços vinculados às agendas
 * GET /agenda-services
 */
export const listAgendaServices = async (req, res, next) => {
  try {
    // Dica: Em um cenário real, você provavelmente faria JOINs aqui
    // para trazer o nome do serviço e o nome do status, não só os IDs.
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

    // Validação básica
    if (!agend_id || !serv_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Os campos agend_id e serv_id são obrigatórios.'
      });
    }

    const query = `
      INSERT INTO agenda_servicos (
        agend_id,
        serv_id,
        agend_serv_situ_id
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    // Se o status não for enviado, assume NULL (ou você pode definir um default aqui)
    const values = [agend_id, serv_id, agend_serv_situ_id || null];

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
 * Atualiza um serviço agendado (PATCH Dinâmico)
 * PATCH /agenda-services/:agend_serv_id
 */
export const updateAgendaService = async (req, res, next) => {
  try {
    const { agend_serv_id } = req.params;
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

    // Lista de campos permitidos para alteração
    const allowedFields = ['agend_id', 'serv_id', 'agend_serv_situ_id'];

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

    // Adiciona o ID no final
    values.push(agend_serv_id);

    const query = `
      UPDATE agenda_servicos
      SET ${fields.join(', ')}
      WHERE agend_serv_id = $${index}
      RETURNING *;
    `;

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