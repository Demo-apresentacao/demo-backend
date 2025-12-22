import pool from '../config/db.js';

// GET /availability
// Lista todas as disponibilidades cadastradas
export const listAvailability = async (req, res, next) => {
  try {
    const query = `
      SELECT
        disp_id,
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

// POST /availability
// Cadastra uma nova disponibilidade
export const createAvailability = async (req, res, next) => {
  try {
    const {
      disp_dia,
      disp_periodo,
      disp_hr_ini,
      disp_hr_fin,
      disp_situacao = true
    } = req.body;

    const query = `
      INSERT INTO disponibilidade (
        disp_dia,
        disp_periodo,
        disp_hr_ini,
        disp_hr_fin,
        disp_situacao
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING disp_id;
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
      data: {
        disp_id: result.rows[0].disp_id
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /availability/:disp_id
// Edita os dados de uma disponibilidade
export const updateAvailability = async (req, res, next) => {
  try {
    const { disp_id } = req.params;
    const {
      disp_dia,
      disp_periodo,
      disp_hr_ini,
      disp_hr_fin,
      disp_situacao
    } = req.body;

    const query = `
      UPDATE disponibilidade
         SET disp_dia = $1,
             disp_periodo = $2,
             disp_hr_ini = $3,
             disp_hr_fin = $4,
             disp_situacao = $5
       WHERE disp_id = $6;
    `;

    const values = [
      disp_dia,
      disp_periodo,
      disp_hr_ini,
      disp_hr_fin,
      disp_situacao,
      disp_id
    ];

    await pool.query(query, values);

    return res.json({
      status: 'success',
      message: `Disponibilidade ${disp_id} atualizada com sucesso`
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /availability/status/:disp_id
// Habilita ou desabilita uma disponibilidade
export const toggleAvailabilityStatus = async (req, res, next) => {
  try {
    const { disp_id } = req.params;
    const { disp_situacao } = req.body;

    const query = `
      UPDATE disponibilidade
         SET disp_situacao = $1
       WHERE disp_id = $2;
    `;

    await pool.query(query, [disp_situacao, disp_id]);

    return res.json({
      status: 'success',
      message: `Disponibilidade ${disp_id} ${
        disp_situacao ? 'habilitada' : 'desabilitada'
      } com sucesso`
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /availability/:disp_id
// Remove uma disponibilidade
export const deleteAvailability = async (req, res, next) => {
  try {
    const { disp_id } = req.params;

    const query = `
      DELETE FROM disponibilidade
       WHERE disp_id = $1;
    `;

    await pool.query(query, [disp_id]);

    return res.json({
      status: 'success',
      message: `Disponibilidade ${disp_id} excluída com sucesso`
    });
  } catch (error) {
    next(error);
  }
};