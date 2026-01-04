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
      ORDER BY veic_usu_id DESC;
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
        u.usu_cpf,
        u.usu_telefone
      FROM veiculo_usuario vu
      JOIN usuarios u ON u.usu_id = vu.usu_id
      WHERE vu.veic_id = $1
      ORDER BY vu.data_final IS NOT NULL, vu.data_final DESC, vu.data_inicial DESC;
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
        v.veic_situacao,
        m.mod_nome,
        ma.mar_nome,
        cat.cat_id
      FROM veiculo_usuario vu
      JOIN veiculos v ON v.veic_id = vu.veic_id
      JOIN modelos m ON v.mod_id = m.mod_id
      JOIN marcas ma ON m.mar_id = ma.mar_id
      JOIN categorias cat ON ma.cat_id = cat.cat_id
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

    if (!veic_id || !usu_id) {
        return res.status(400).json({ status: 'error', message: 'Veículo e Usuário são obrigatórios.' });
    }

    // --- VALIDAÇÃO DE DATA (Ignora horas para permitir "hoje") ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera hora para comparação justa
    
    const inputDate = new Date(data_inicial);
    // Zera hora da entrada também (caso venha com fuso)
    inputDate.setHours(0, 0, 0, 0); 

    if (inputDate > new Date()) { 
        // Aqui comparamos com new Date() com hora cheia, ou seja, se for AMANHÃ
        // Se for hoje, passa.
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0,0,0,0);
        
        if (inputDate >= tomorrow) {
             return res.status(400).json({ status: 'error', message: 'A data inicial não pode ser futura.' });
        }
    }

    // --- VALIDAÇÃO DE DUPLICIDADE ATIVA ---
    const checkQuery = `
        SELECT veic_usu_id FROM veiculo_usuario 
        WHERE veic_id = $1 
          AND usu_id = $2 
          AND data_final IS NULL
    `;
    
    const checkResult = await pool.query(checkQuery, [veic_id, usu_id]);

    if (checkResult.rowCount > 0) {
        return res.status(409).json({ // 409 Conflict
            status: 'error',
            message: 'Este usuário já possui um vínculo ativo com este veículo. Encerre o anterior primeiro.'
        });
    }

    const query = `
      INSERT INTO veiculo_usuario
        (veic_id, usu_id, ehproprietario, data_inicial)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      veic_id,
      usu_id,
      ehproprietario || false,
      data_inicial
    ]);

    return res.status(201).json({
      status: 'success',
      message: 'Vínculo criado com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza dados da associação veículo-usuário (PATCH)
 * PATCH /vehicle-users/:id
 */
export const updateVehicleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data_inicial, data_final, ehproprietario } = req.body;

    // 1. BUSCAR O REGISTRO ATUAL
    const currentRecordResult = await pool.query(
      'SELECT data_inicial, data_final FROM veiculo_usuario WHERE veic_usu_id = $1',
      [id]
    );

    if (currentRecordResult.rowCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Registro não encontrado.' });
    }

    const currentRecord = currentRecordResult.rows[0];

    // 2. PREPARAR DADOS (Mescla novo com antigo)
    const nextDataInicial = data_inicial !== undefined ? data_inicial : currentRecord.data_inicial;
    const nextDataFinal = data_final !== undefined ? data_final : currentRecord.data_final;

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Hoje vai até o último segundo

    // 3. REGRAS DE NEGÓCIO

    // Validação A: Data Inicial no Futuro
    if (nextDataInicial && new Date(nextDataInicial) > today) {
        return res.status(400).json({ status: 'error', message: 'A Data Inicial não pode ser futura.' });
    }

    // Validação B: Data Final no Futuro
    if (nextDataFinal && new Date(nextDataFinal) > today) {
        return res.status(400).json({ status: 'error', message: 'A Data Final não pode ser futura.' });
    }

    // Validação C: Data Final antes da Inicial
    if (nextDataInicial && nextDataFinal) {
        if (new Date(nextDataFinal) < new Date(nextDataInicial)) {
            return res.status(400).json({ status: 'error', message: 'A Data Final não pode ser anterior à Data Inicial.' });
        }
    }

    // 4. MONTAGEM DINÂMICA
    const fields = [];
    const values = [];
    let paramIndex = 1;

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

    if (fields.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Nenhum campo enviado para atualização.' });
    }

    values.push(id);

    const query = `
      UPDATE veiculo_usuario
      SET ${fields.join(', ')}
      WHERE veic_usu_id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    return res.json({
      status: 'success',
      message: 'Vínculo atualizado com sucesso.',
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

    // Verifica se existe antes
    const check = await pool.query('SELECT veic_usu_id FROM veiculo_usuario WHERE veic_usu_id = $1', [id]);
    if (check.rowCount === 0) {
         return res.status(404).json({ status: 'error', message: 'Registro não encontrado.' });
    }

    await pool.query(
      'DELETE FROM veiculo_usuario WHERE veic_usu_id = $1',
      [id]
    );

    return res.json({
      status: 'success',
      message: 'Vínculo removido com sucesso.'
    });
  } catch (error) {
    // Proteção de FK: Se esse vínculo foi usado para gerar um agendamento
    if (error.code === '23503') {
        return res.status(409).json({ 
            status: 'error', 
            message: 'Não é possível excluir este vínculo pois existem agendamentos históricos ligados a ele. Tente encerrar a data final em vez de excluir.' 
        });
    }
    next(error);
  }
};