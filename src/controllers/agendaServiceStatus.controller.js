import pool from '../config/db.js';

export const listAgendaServiceStatus = async (req, res, next) => {
  try {
    const query = `
        SELECT agend_serv_situ_id,
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


export const createAgendaServiceStatus = async (req, res, next) => {
  try {
    const { agend_serv_situ_nome } = req.body;

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


export const updateAgendaServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verifica se veio algum dado no corpo
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo fornecido para atualização.'
      });
    }

    const fields = [];
    const values = [];
    let index = 1;

    const allowedFields = ['agend_serv_situ_nome'];

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


export const deleteAgendaServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE 
        FROM agenda_servicos_situacao
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
    
    if (error.code === '23503') {
      return res.status(409).json({
        status: 'error',
        message: 'Não é possível excluir este status pois ele está vinculado a agendamentos existentes.'
      });
    }
    next(error);
  }
};