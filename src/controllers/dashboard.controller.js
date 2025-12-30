import pool from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        const client = await pool.connect();
        
        // 1. Definições de Tempo
        const now = new Date();
        const hoje = now.toISOString().split('T')[0];
        const mesAtual = now.toISOString().slice(0, 7);
        
        // Mantemos a hora apenas para referência se precisar, mas a lógica mudou
        const hora = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const horaAtual = `${hora}:${min}`;

        try {
            // --- BLOCO 1: EM ANDAMENTO (NOVA LÓGICA: FILA DE PRIORIDADE) ---
            // Pega o PRIMEIRO agendamento PENDENTE do dia.
            // Se for 14h e tiver um das 08h pendente, ele pega o das 08h.
            const andamentoRes = await client.query(`
                SELECT a.agend_id, a.agend_horario, v.veic_placa, m.mod_nome, u.usu_nome, u.usu_telefone,
                       STRING_AGG(s.serv_nome, ' + ') as lista_servicos
                FROM agendamentos a
                JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
                JOIN veiculos v ON vu.veic_id = v.veic_id
                JOIN modelos m ON v.mod_id = m.mod_id
                JOIN usuarios u ON vu.usu_id = u.usu_id
                LEFT JOIN agenda_servicos ags ON a.agend_id = ags.agend_id
                LEFT JOIN servicos s ON ags.serv_id = s.serv_id
                WHERE a.agend_data = $1 
                  AND a.agend_situacao = 1 -- APENAS PENDENTES
                GROUP BY a.agend_id, a.agend_horario, v.veic_placa, m.mod_nome, u.usu_nome, u.usu_telefone
                ORDER BY a.agend_horario ASC -- O MAIS ANTIGO PRIMEIRO
                LIMIT 1
            `, [hoje]);

            const agendamentoAtual = andamentoRes.rows[0] || null;
            const idEmAndamento = agendamentoAtual ? agendamentoAtual.agend_id : 0;

            // --- BLOCO 2: CONSULTAS PARALELAS ---
            const [clientesRes, veiculosHojeRes, faturamentoRes, concluidosRes, proximasRes, graficoRes] = await Promise.all([
                // Cards Stats
                client.query('SELECT COUNT(*) FROM usuarios'),
                client.query('SELECT COUNT(*) FROM agendamentos WHERE agend_data = $1 AND agend_situacao != 0', [hoje]),
                client.query(`
                    SELECT SUM(s.serv_preco) as total 
                    FROM agenda_servicos ags
                    JOIN servicos s ON ags.serv_id = s.serv_id
                    JOIN agendamentos a ON ags.agend_id = a.agend_id
                    WHERE TO_CHAR(a.agend_data, 'YYYY-MM') = $1 AND a.agend_situacao = 3
                `, [mesAtual]),
                client.query(`
                    SELECT COUNT(*) FROM agendamentos 
                    WHERE TO_CHAR(agend_data, 'YYYY-MM') = $1 AND agend_situacao = 3
                `, [mesAtual]),

                // PRÓXIMAS ENTRADAS (NOVA LÓGICA: RESTANTE DA FILA)
                // Mostra tudo que é pendente e não é o principal.
                // Removemos o filtro de hora (>= $2) para não esconder atrasados.
                client.query(`
                    SELECT a.agend_horario, v.veic_placa, m.mod_nome, u.usu_nome,
                       (SELECT s.serv_nome FROM servicos s 
                        JOIN agenda_servicos ags ON s.serv_id = ags.serv_id 
                        WHERE ags.agend_id = a.agend_id LIMIT 1) as servico_principal
                    FROM agendamentos a
                    JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
                    JOIN veiculos v ON vu.veic_id = v.veic_id
                    JOIN modelos m ON v.mod_id = m.mod_id
                    JOIN usuarios u ON vu.usu_id = u.usu_id
                    WHERE a.agend_data = $1 
                      AND a.agend_situacao = 1 -- APENAS PENDENTES
                      AND a.agend_id != $2     -- IGNORA O QUE JÁ ESTÁ NO BOX PRINCIPAL
                    ORDER BY a.agend_horario ASC
                    LIMIT 4
                `, [hoje, idEmAndamento]),

                // Gráfico
                client.query(`
                    SELECT s.serv_nome, COUNT(*) as total
                    FROM agenda_servicos ags
                    JOIN servicos s ON ags.serv_id = s.serv_id
                    JOIN agendamentos a ON ags.agend_id = a.agend_id
                    WHERE TO_CHAR(a.agend_data, 'YYYY-MM') = $1
                    GROUP BY s.serv_nome
                    ORDER BY total DESC
                    LIMIT 5
                `, [mesAtual])
            ]);

            return res.json({
                status: 'success',
                cards: {
                    clientes_totais: clientesRes.rows[0].count,
                    veiculos_hoje: veiculosHojeRes.rows[0].count,
                    faturamento_mes: faturamentoRes.rows[0].total || 0,
                    concluidos_mes: concluidosRes.rows[0].count
                },
                em_andamento: agendamentoAtual,
                proximas_entradas: proximasRes.rows,
                grafico_servicos: graficoRes.rows
            });

        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Erro Dashboard:", error);
        next(error);
    }
};