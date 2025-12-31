import pool from '../config/db.js';

/**
 * Lista todas as associações entre veículos e usuários
 * GET /vehicle-users
 */
export const listVehicleUsers = async (req, res, next) => {
  try {
    const query = `
      SELECT
        veic_usu_id,
        veic_id,
        usu_id,
        ehproprietario,
        data_inicial,
        data_final
      FROM veiculo_usuario
      ORDER BY veic_usu_id;
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
 * Lista os usuários associados a um veículo específico
 * GET /vehicle-users/vehicle/:vehicleId
 */
export const listUsersByVehicle = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const query = `
      SELECT
        vu.veic_usu_id,
        vu.veic_id,
        vu.usu_id,
        vu.ehproprietario,
        vu.data_inicial,
        vu.data_final,
        u.usu_nome,
        u.usu_cpf
      FROM veiculo_usuario vu
      JOIN usuarios u ON u.usu_id = vu.usu_id
      WHERE vu.veic_id = $1
      ORDER BY vu.data_final IS NOT NULL, vu.data_final DESC, vu.data_inicial ASC;
    `;

    const result = await pool.query(query, [vehicleId]);

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
 * Lista os veículos ativos de um usuário
 * GET /vehicle-users/user/:userId
 */
export const listVehiclesByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT
        vu.veic_usu_id,
        vu.data_inicial,
        vu.data_final,
        vu.ehproprietario,
        v.veic_id,
        v.veic_placa,
        v.veic_ano,
        v.veic_cor,
        v.veic_combustivel,
        v.veic_observ,
        v.veic_situacao
      FROM veiculo_usuario vu
      JOIN veiculos v ON v.veic_id = vu.veic_id
      WHERE vu.usu_id = $1
        AND vu.data_final IS NULL
        AND v.veic_situacao = TRUE;
    `;

    const result = await pool.query(query, [userId]);

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
 * Cria uma nova associação entre veículo e usuário
 * POST /vehicle-users
 */
export const createVehicleUser = async (req, res, next) => {
  try {
    const { veic_id, usu_id, ehproprietario, data_inicial } = req.body;

    const query = `
      INSERT INTO veiculo_usuario
        (veic_id, usu_id, ehproprietario, data_inicial)
      VALUES ($1, $2, $3, $4)
      RETURNING veic_usu_id;
    `;

    const result = await pool.query(query, [
      veic_id,
      usu_id,
      ehproprietario,
      data_inicial
    ]);

    return res.status(201).json({
      status: 'success',
      message: 'Associação veículo-usuário criada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza dados da associação veículo-usuário
 * PATCH /vehicle-users/:id
 */
export const updateVehicleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data_inicial, data_final, ehproprietario } = req.body;

    // 1. Array para guardar os campos que VAMOS atualizar
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // 2. Só adiciona na query SE o dado foi enviado
    if (data_inicial !== undefined) {
      fields.push(`data_inicial = $${paramIndex++}`);
      values.push(data_inicial);
    }

    if (data_final !== undefined) {
      fields.push(`data_final = $${paramIndex++}`);
      values.push(data_final);
    }

    if (ehproprietario !== undefined) {
      fields.push(`ehproprietario = $${paramIndex++}`);
      values.push(ehproprietario);
    }

    // Se não enviou nada para atualizar, retorna erro ou sucesso vazio
    if (fields.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Nenhum campo enviado para atualização.' 
      });
    }

    // 3. Adiciona o ID no final dos valores
    values.push(id);

    // 4. Monta a query final
    const query = `
      UPDATE veiculo_usuario
      SET ${fields.join(', ')}
      WHERE veic_usu_id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Registro não encontrado.' 
      });
    }

    return res.json({
      status: 'success',
      message: 'Associação atualizada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Remove a associação entre veículo e usuário
 * DELETE /vehicle-users/:id
 */
export const deleteVehicleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM veiculo_usuario WHERE veic_usu_id = $1',
      [id]
    );

    return res.json({
      status: 'success',
      message: 'Associação removida com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};