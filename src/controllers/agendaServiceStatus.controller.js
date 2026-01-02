import pool from '../config/db.js';

/**
 * Lista todas as situações possíveis da agenda de serviços
 * GET /agenda-services-status
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
 * POST /agenda-services-status
 */
export const createAgendaServiceStatus = async (req, res, next) => {
  try {
    const { agend_serv_situ_nome } = req.body;

    // Validação básica
    if (!agend_serv_situ_nome) {
      return res.status(400).json({
        status: 'error',
        message: 'O campo agend_serv_situ_nome é obrigatório.'
      });
    }

    const query = `
      INSERT INTO agenda_servicos_situacao (agend_serv_situ_nome)
      VALUES ($1)
      RETURNING agend_serv_situ_id, agend_serv_situ_nome;
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
 * Atualiza uma situação da agenda de serviços (PATCH Dinâmico)
 * PATCH /agenda-services-status/:id
 */
export const updateAgendaServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 1. Verifica se veio algum dado no corpo
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo fornecido para atualização.'
      });
    }

    // 2. Montagem Dinâmica da Query SQL
    const fields = [];
    const values = [];
    let index = 1;

    // Mapeamento dos campos permitidos para atualização
    // Isso impede que o usuário tente injetar colunas que não existem ou não devem ser alteradas
    const allowedFields = ['agend_serv_situ_nome'];

    for (const key in updates) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index++;
      }
    }

    // Se após filtrar não sobrou nenhum campo válido
    if (fields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo válido para atualização.'
      });
    }

    // Adiciona o ID como o último parâmetro da query
    values.push(id);

    const query = `
      UPDATE agenda_servicos_situacao
      SET ${fields.join(', ')}
      WHERE agend_serv_situ_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Status não encontrado.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Situação atualizada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma situação da agenda de serviços
 * DELETE /agenda-services-status/:id
 */
export const deleteAgendaServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM agenda_servicos_situacao
      WHERE agend_serv_situ_id = $1
      RETURNING agend_serv_situ_id;
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Status não encontrado para exclusão.'
      });
    }

    return res.json({
      status: 'success',
      message: `Situação ${id} removida com sucesso.`
    });
  } catch (error) {
    // Tratamento específico para erro de chave estrangeira (se o status estiver em uso)
    if (error.code === '23503') {
      return res.status(409).json({
        status: 'error',
        message: 'Não é possível excluir este status pois ele está vinculado a agendamentos existentes.'
      });
    }
    next(error);
  }
};