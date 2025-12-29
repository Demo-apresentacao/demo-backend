import pool from '../config/db.js';

// GET /appointments
// Lista agendamentos com paginação, filtro e dados do cliente/veículo
export const listAppointments = async (req, res, next) => {
  try {
    // Agora recebemos date e status na query string
    const { search, date, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM agendamentos a
      JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
      JOIN usuarios u ON vu.usu_id = u.usu_id
      JOIN veiculos v ON vu.veic_id = v.veic_id
      LEFT JOIN agenda_servicos ags ON a.agend_id = ags.agend_id
      LEFT JOIN servicos s ON ags.serv_id = s.serv_id
    `;

    // --- CONSTRUÇÃO DINÂMICA DO WHERE ---
    const conditions = [];
    const values = [];
    let paramCounter = 1;

    // 1. Filtro de Texto (Nome ou Placa)
    if (search) {
      conditions.push(`(u.usu_nome ILIKE $${paramCounter} OR v.veic_placa ILIKE $${paramCounter})`);
      values.push(`%${search}%`);
      paramCounter++;
    }

    // 2. Filtro de Data
    if (date) {
      conditions.push(`a.agend_data = $${paramCounter}`);
      values.push(date);
      paramCounter++;
    }

    // 3. Filtro de Status
    if (status) {
      conditions.push(`a.agend_situacao = $${paramCounter}`);
      values.push(status); // O front deve mandar o ID (1, 2, 0...)
      paramCounter++;
    }

    // Monta a cláusula WHERE se houver condições
    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';

    // --- QUERY FINAL ---
    let queryText = `
      SELECT 
        a.agend_id,
        a.agend_data,
        a.agend_horario,
        a.agend_situacao,
        v.veic_placa,
        u.usu_nome,
        STRING_AGG(s.serv_nome, ', ') AS lista_servicos
      ${baseQuery}
      ${whereClause}
      GROUP BY a.agend_id, a.agend_data, a.agend_horario, a.agend_situacao, v.veic_placa, u.usu_nome 
    `;

    // --- QUERY DE CONTAGEM ---
    let countQuery = `
      SELECT COUNT(DISTINCT a.agend_id) as total 
      ${baseQuery}
      ${whereClause}
    `;

    // Ordenação e Paginação
    queryText += ` ORDER BY a.agend_data DESC, a.agend_horario DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limit, offset);

    const result = await pool.query(queryText, values);
    
    // Para o count, usamos os values originais (sem limit/offset)
    const countValues = values.slice(0, paramCounter - 1); 
    const countResult = await pool.query(countQuery, countValues);

    const totalItems = parseInt(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: 'success',
      data: result.rows,
      meta: { totalItems, totalPages, currentPage: parseInt(page), itemsPerPage: parseInt(limit) }
    });

  } catch (error) {
    console.error("ERRO LISTAGEM AGENDAMENTOS:", error);
    next(error);
  }
};

// GET /appointments/:id
// Busca detalhes + Lista de serviços vinculados
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Dados Principais
    const queryMain = `
      SELECT 
        a.*,
        u.usu_nome,
        u.usu_telefone,
        m.mod_nome AS veic_modelo, -- <--- CORRIGIDO AQUI TAMBÉM
        v.veic_placa
      FROM agendamentos a
      JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
      JOIN usuarios u ON vu.usu_id = u.usu_id
      JOIN veiculos v ON vu.veic_id = v.veic_id
      JOIN modelos m ON v.mod_id = m.mod_id -- <--- NOVO JOIN
      WHERE a.agend_id = $1
    `;
    const resultMain = await pool.query(queryMain, [id]);

    if (resultMain.rows.length === 0) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    // 2. Serviços deste agendamento
    const queryServices = `
        SELECT 
            ags.agend_serv_id,
            s.serv_nome,
            s.serv_preco,
            sit.agend_serv_situ_nome
        FROM agenda_servicos ags
        JOIN servicos s ON ags.serv_id = s.serv_id
        JOIN agenda_servicos_situacao sit ON ags.agend_serv_situ_id = sit.agend_serv_situ_id
        WHERE ags.agend_id = $1
    `;
    const resultServices = await pool.query(queryServices, [id]);

    const appointmentData = {
        ...resultMain.rows[0],
        servicos: resultServices.rows // Anexa a lista de serviços ao objeto
    };

    return res.json({ status: 'success', data: appointmentData });

  } catch (error) {
    next(error);
  }
};

// ... O RESTO (create, update, cancel) PODE MANTER IGUAL ...
// (Só copiei a parte do GET que estava dando erro)

export const createAppointment = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const {
            veic_usu_id,
            agend_data,
            agend_horario,
            agend_observ,
            services 
        } = req.body;

        await client.query('BEGIN');

        const insertAgendQuery = `
            INSERT INTO agendamentos (veic_usu_id, agend_data, agend_horario, agend_observ, agend_situacao)
            VALUES ($1, $2, $3, $4, 1)
            RETURNING agend_id
        `;
        const resAgend = await client.query(insertAgendQuery, [veic_usu_id, agend_data, agend_horario, agend_observ]);
        const newAgendId = resAgend.rows[0].agend_id;

        if (services && services.length > 0) {
            for (const servId of services) {
                await client.query(`
                    INSERT INTO agenda_servicos (agend_id, serv_id, agend_serv_situ_id)
                    VALUES ($1, $2, 1) 
                `, [newAgendId, servId]); 
            }
        }

        await client.query('COMMIT');

        return res.status(201).json({
            status: 'success',
            message: 'Agendamento criado com sucesso',
            data: { agend_id: newAgendId }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

export const updateAppointment = async (req, res, next) => {
    const client = await pool.connect(); // Precisamos de transação aqui também
    try {
        const { id } = req.params;
        // Agora pegamos também o array 'services' do corpo da requisição
        const { agend_data, agend_horario, agend_observ, agend_situacao, services } = req.body;

        await client.query('BEGIN');

        // 1. Atualiza dados principais do Agendamento
        const updateQuery = `
            UPDATE agendamentos
            SET agend_data = $1, agend_horario = $2, agend_observ = $3, agend_situacao = $4
            WHERE agend_id = $5
            RETURNING *
        `;
        const result = await client.query(updateQuery, [agend_data, agend_horario, agend_observ, agend_situacao, id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }

        // 2. Atualiza a lista de Serviços (Se o array services foi enviado)
        if (services && Array.isArray(services)) {
            // A) Remove TODOS os serviços antigos desse agendamento
            await client.query(`DELETE FROM agenda_servicos WHERE agend_id = $1`, [id]);

            // B) Insere os NOVOS serviços selecionados
            if (services.length > 0) {
                for (const servId of services) {
                    await client.query(`
                        INSERT INTO agenda_servicos (agend_id, serv_id, agend_serv_situ_id)
                        VALUES ($1, $2, 1) 
                    `, [id, servId]);
                    // Nota: Reiniciamos o status do serviço como 1 (Pendente) ao readicionar, 
                    // ou você pode criar uma lógica para manter status antigo se preferir complexidade.
                }
            }
        }

        await client.query('COMMIT');

        return res.json({ status: 'success', data: result.rows[0] });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Erro ao atualizar agendamento:", error);
        next(error);
    } finally {
        client.release();
    }
};

export const cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `UPDATE agendamentos SET agend_situacao = 0 WHERE agend_id = $1`;
        await pool.query(query, [id]);
        return res.json({ status: 'success', message: 'Agendamento cancelado' });
    } catch (error) {
        next(error);
    }
};