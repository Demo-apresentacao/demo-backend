import pool from '../config/db.js';

// --- FUNÇÕES AUXILIARES (HELPERS) ---

// Converte string "HH:MM:SS" para minutos totais (ex: "01:30" -> 90)
const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60) + m;
};

// Adiciona minutos a um horário e retorna "HH:MM"
const addMinutesToTime = (timeStr, minutesToAdd) => {
    const totalMinutes = timeToMinutes(timeStr) + minutesToAdd;
    const h = Math.floor(totalMinutes / 60) % 24; // % 24 para virar o dia se necessário
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Verifica se dois intervalos se sobrepõem
// (StartA < EndB) e (EndA > StartB)
const isOverlapping = (startA, endA, startB, endB) => {
    return (startA < endB) && (endA > startB);
};

// Função Principal de Validação de Conflito e Horário de Expediente
const verificarConflito = async (client, agendData, agendHorario, serviceIds, excludeAgendId = null) => {

    // 1. Calcular a duração total dos serviços solicitados
    let totalDurationMinutes = 0;

    if (serviceIds && serviceIds.length > 0) {
        const servicesQuery = `
            SELECT serv_duracao FROM servicos WHERE serv_id = ANY($1::int[])
        `;
        const resServices = await client.query(servicesQuery, [serviceIds]);

        resServices.rows.forEach(s => {
            totalDurationMinutes += timeToMinutes(s.serv_duracao);
        });
    }

    if (totalDurationMinutes === 0) totalDurationMinutes = 30; // Mínimo de 30 min se não tiver serviço

    const startMin = timeToMinutes(agendHorario);
    const endMin = startMin + totalDurationMinutes;

    // --- NOVA VALIDAÇÃO: HORÁRIO DE EXPEDIENTE E ALMOÇO ---

    // Definição dos turnos em minutos
    const MANHA_INICIO = 7 * 60;  // 07:00 (420)
    const MANHA_FIM = 11 * 60; // 11:00 (660)

    const TARDE_INICIO = 13 * 60; // 13:00 (780)
    const TARDE_FIM = 18 * 60; // 18:00 (1080)

    // Verifica se cabe INTEIRO na manhã OU cabe INTEIRO na tarde
    const fitsInMorning = (startMin >= MANHA_INICIO && endMin <= MANHA_FIM);
    const fitsInAfternoon = (startMin >= TARDE_INICIO && endMin <= TARDE_FIM);

    if (!fitsInMorning && !fitsInAfternoon) {
        // Vamos dar uma mensagem bem específica para ajudar o usuário
        const fimFormatado = addMinutesToTime(agendHorario, totalDurationMinutes);

        if (startMin < MANHA_INICIO || endMin > TARDE_FIM) {
            throw new Error(`Fora do expediente! A oficina funciona das 07:00 às 11:00 e das 13:00 às 18:00.`);
        } else {
            throw new Error(`Horário de Almoço! O serviço terminaria às ${fimFormatado}, invadindo a pausa (11h-13h).`);
        }
    }
    // -----------------------------------------------------

    // 2. Se passou no horário, agora busca conflitos com OUTROS agendamentos no banco
    const existingQuery = `
        SELECT 
            a.agend_id, 
            a.agend_horario, 
            v.veic_id,
            v.veic_placa,
            SUM(EXTRACT(EPOCH FROM s.serv_duracao)/60) as duracao_total_min
        FROM agendamentos a
        JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
        JOIN veiculos v ON vu.veic_id = v.veic_id
        LEFT JOIN agenda_servicos ags ON a.agend_id = ags.agend_id
        LEFT JOIN servicos s ON ags.serv_id = s.serv_id
        WHERE a.agend_data = $1 
          AND a.agend_situacao != 0 
          ${excludeAgendId ? 'AND a.agend_id != $2' : ''} 
        GROUP BY a.agend_id, a.agend_horario, v.veic_placa, v.veic_id
    `;

    const params = excludeAgendId ? [agendData, excludeAgendId] : [agendData];
    const existingRes = await client.query(existingQuery, params);

    // 3. Comparar conflitos com outros carros
    for (const agend of existingRes.rows) {
        const existStartMin = timeToMinutes(agend.agend_horario);
        const existDuration = parseFloat(agend.duracao_total_min) || 30;
        const existEndMin = existStartMin + existDuration;

        if (isOverlapping(startMin, endMin, existStartMin, existEndMin)) {
            const fimAgend = addMinutesToTime(agend.agend_horario, existDuration);
            throw new Error(`Conflito de horário! Já existe um agendamento (Placa: ${agend.veic_placa}) ocupando das ${agend.agend_horario.substring(0, 5)} às ${fimAgend}.`);
        }
    }
};
// --- CONTROLLERS ---

// GET /appointments
export const listAppointments = async (req, res, next) => {
    try {
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

        const conditions = [];
        const values = [];
        let paramCounter = 1;

        if (search) {
            conditions.push(`(u.usu_nome ILIKE $${paramCounter} OR v.veic_placa ILIKE $${paramCounter})`);
            values.push(`%${search}%`);
            paramCounter++;
        }
        if (date) {
            conditions.push(`a.agend_data = $${paramCounter}`);
            values.push(date);
            paramCounter++;
        }
        if (status) {
            conditions.push(`a.agend_situacao = $${paramCounter}`);
            values.push(status);
            paramCounter++;
        }

        const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';

        let queryText = `
      SELECT 
        a.agend_id, a.agend_data, a.agend_horario, a.agend_situacao,
        v.veic_placa, u.usu_nome,
        STRING_AGG(s.serv_nome, ', ') AS lista_servicos
      ${baseQuery}
      ${whereClause}
      GROUP BY a.agend_id, a.agend_data, a.agend_horario, a.agend_situacao, v.veic_placa, u.usu_nome 
    `;

        let countQuery = `SELECT COUNT(DISTINCT a.agend_id) as total ${baseQuery} ${whereClause}`;

        queryText += ` ORDER BY a.agend_data DESC, a.agend_horario DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        values.push(limit, offset);

        const result = await pool.query(queryText, values);
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
export const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const queryMain = `
      SELECT 
        a.*, u.usu_nome, u.usu_telefone, m.mod_nome AS veic_modelo, v.veic_placa
      FROM agendamentos a
      JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
      JOIN usuarios u ON vu.usu_id = u.usu_id
      JOIN veiculos v ON vu.veic_id = v.veic_id
      JOIN modelos m ON v.mod_id = m.mod_id
      WHERE a.agend_id = $1
    `;
        const resultMain = await pool.query(queryMain, [id]);

        if (resultMain.rows.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        const queryServices = `
        SELECT ags.agend_serv_id, s.serv_id, s.serv_nome, s.serv_preco, sit.agend_serv_situ_nome
        FROM agenda_servicos ags
        JOIN servicos s ON ags.serv_id = s.serv_id
        JOIN agenda_servicos_situacao sit ON ags.agend_serv_situ_id = sit.agend_serv_situ_id
        WHERE ags.agend_id = $1
    `;
        const resultServices = await pool.query(queryServices, [id]);

        return res.json({
            status: 'success',
            data: { ...resultMain.rows[0], servicos: resultServices.rows }
        });

    } catch (error) {
        next(error);
    }
};

// POST /appointments (COM VALIDAÇÃO DE CONFLITO)
export const createAppointment = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { veic_usu_id, agend_data, agend_horario, agend_observ, services } = req.body;

        // --- VALIDAÇÃO DE CONFLITO ---
        // Se services vier vazio, cuidado!
        const servicesToCheck = (services && services.length > 0) ? services : [];
        await verificarConflito(client, agend_data, agend_horario, servicesToCheck);
        // -----------------------------

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

        // --- ATUALIZAÇÃO AQUI ---
        // Verifica se é erro de Conflito, Expediente ou Almoço
        if (error.message.includes("Conflito de horário") ||
            error.message.includes("Fora do expediente") ||
            error.message.includes("Horário de Almoço")) {

            // Retorna 400 (Bad Request) para o frontend saber que é aviso
            return res.status(400).json({ status: 'error', message: error.message });
        }

        console.error("Erro interno:", error);
        next(error);
    } finally {
        client.release();
    }
};

// PUT /appointments/:id (COM VALIDAÇÃO DE CONFLITO)
export const updateAppointment = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { agend_data, agend_horario, agend_observ, agend_situacao, services } = req.body;

        // --- PREPARAÇÃO PARA VALIDAÇÃO ---
        // Precisamos saber quais serviços estarão valendo para calcular a duração.
        // Se o usuário mandou 'services' no body, usamos eles.
        // Se NÃO mandou (só editou horário), precisamos buscar os serviços que já existem no banco.

        let effectiveServicesIds = services;

        if (!effectiveServicesIds) {
            // Busca serviços atuais do agendamento
            const currentServicesRes = await client.query(
                `SELECT serv_id FROM agenda_servicos WHERE agend_id = $1`,
                [id]
            );
            effectiveServicesIds = currentServicesRes.rows.map(row => row.serv_id);
        }

        // --- VALIDAÇÃO DE CONFLITO ---
        // Passamos o ID atual para ignorá-lo na busca (não conflitar com ele mesmo)
        await verificarConflito(client, agend_data, agend_horario, effectiveServicesIds, id);
        // -----------------------------

        await client.query('BEGIN');

        // 1. Atualiza dados principais
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

        // 2. Atualiza Serviços (apenas se o array foi enviado)
        if (services && Array.isArray(services)) {
            await client.query(`DELETE FROM agenda_servicos WHERE agend_id = $1`, [id]);
            if (services.length > 0) {
                for (const servId of services) {
                    await client.query(`
                        INSERT INTO agenda_servicos (agend_id, serv_id, agend_serv_situ_id)
                        VALUES ($1, $2, 1) 
                    `, [id, servId]);
                }
            }
        }

        await client.query('COMMIT');
        return res.json({ status: 'success', data: result.rows[0] });

    } catch (error) {
        await client.query('ROLLBACK');

        // Verifica se é erro de Conflito, Expediente ou Almoço
        if (error.message.includes("Conflito de horário") ||
            error.message.includes("Fora do expediente") ||
            error.message.includes("Horário de Almoço")) {

            // Retorna 400 (Bad Request) para o frontend saber que é aviso
            return res.status(400).json({ status: 'error', message: error.message });
        }

        console.error("Erro interno:", error);
        next(error);
    }
};

// PATCH /cancel
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