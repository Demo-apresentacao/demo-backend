import pool from '../config/db.js';


export const listAvailability = async (req, res, next) => {
  try {
    const query = `
        SELECT disp_id,
               disp_dia,
               disp_periodo,
               disp_hr_ini,
               disp_hr_fin,
               disp_situacao
          FROM disponibilidade
      ORDER BY disp_id;
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


export const createAvailability = async (req, res, next) => {
  try {
    const {
      disp_dia,
      disp_periodo,
      disp_hr_ini,
      disp_hr_fin,
      disp_situacao = true
    } = req.body;

    // Validação básica
    if (!disp_dia || !disp_periodo || !disp_hr_ini || !disp_hr_fin) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos os campos (dia, periodo, hr_ini, hr_fin) são obrigatórios.'
      });
    }

    const query = `
      INSERT INTO disponibilidade (
        disp_dia,
        disp_periodo,
        disp_hr_ini,
        disp_hr_fin,
        disp_situacao
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      disp_dia,
      disp_periodo,
      disp_hr_ini,
      disp_hr_fin,
      disp_situacao
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Disponibilidade criada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};


export const updateAvailability = async (req, res, next) => {
  try {
    const { disp_id } = req.params;
    const updates = req.body;

    // 1. Verifica se veio algum dado
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo fornecido para atualização.'
      });
    }

    const fields = [];
    const values = [];
    let index = 1;

    const allowedFields = ['disp_dia', 'disp_periodo', 'disp_hr_ini', 'disp_hr_fin', 'disp_situacao'];

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

    values.push(disp_id);

    const query = `
      UPDATE disponibilidade
         SET ${fields.join(', ')}
      WHERE disp_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Disponibilidade não encontrada.'
      });
    }

    return res.json({
      status: 'success',
      message: `Disponibilidade atualizada com sucesso`,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
 

export const toggleAvailabilityStatus = async (req, res, next) => {
  try {
    const { disp_id } = req.params;
    const { disp_situacao } = req.body;

    // Validação para garantir que boolean foi enviado
    if (disp_situacao === undefined || disp_situacao === null) {
       return res.status(400).json({ status: 'error', message: 'O campo disp_situacao é obrigatório.' });
    }

    const query = `
      UPDATE disponibilidade
         SET disp_situacao = $1
       WHERE disp_id = $2
      RETURNING disp_id, disp_situacao;
    `;

    const result = await pool.query(query, [disp_situacao, disp_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Disponibilidade não encontrada.' });
    }

    return res.json({
      status: 'success',
      message: `Disponibilidade ${disp_situacao ? 'habilitada' : 'desabilitada'} com sucesso`,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};



export const deleteAvailability = async (req, res, next) => {
  try {
    const { disp_id } = req.params;

    const query = `
      DELETE 
        FROM disponibilidade
       WHERE disp_id = $1
      RETURNING disp_id;
    `;

    const result = await pool.query(query, [disp_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Disponibilidade não encontrada.'
      });
    }

    return res.json({
      status: 'success',
      message: `Disponibilidade removida com sucesso`
    });
  } catch (error) {
    next(error);
  }
};