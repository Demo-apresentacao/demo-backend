import pool from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        const client = await pool.connect();

        // 1. Definições de Tempo
        const now = new Date();
        const hoje = now.toISOString().split('T')[0];
        const mesAtual = now.toISOString().slice(0, 7);

        try {
            // --- BLOCO 1: EM ANDAMENTO (CORRIGIDO) ---
            // Prioridade:
            // 1º - Mostra quem está SENDO ATENDIDO AGORA (Status 2 - Em Execução)
            // 2º - Se ninguém estiver sendo atendido, mostra o PRÓXIMO PENDENTE (Status 1 - Agendado)
            // Ordena por prioridade de status (Em execução vem antes) e depois por horário.
            const andamentoRes = await client.query(`
                SELECT a.agend_id, a.agend_horario, a.agend_situacao, 
                       v.veic_placa, m.mod_nome, u.usu_nome, u.usu_telefone,
                       STRING_AGG(s.serv_nome, ' + ') as lista_servicos
                FROM agendamentos a
                JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
                JOIN veiculos v ON vu.veic_id = v.veic_id
                JOIN modelos m ON v.mod_id = m.mod_id
                JOIN usuarios u ON vu.usu_id = u.usu_id
                LEFT JOIN agenda_servicos ags ON a.agend_id = ags.agend_id
                LEFT JOIN servicos s ON ags.serv_id = s.serv_id
                WHERE a.agend_data = $1 
                  AND a.agend_situacao IN (1, 2) -- Pega Pendentes (1) e Em Execução (2)
                GROUP BY a.agend_id, a.agend_horario, a.agend_situacao, v.veic_placa, m.mod_nome, u.usu_nome, u.usu_telefone
                ORDER BY 
                    CASE WHEN a.agend_situacao = 2 THEN 0 ELSE 1 END, -- Prioriza Status 2 (Em Execução)
                    a.agend_horario ASC -- Desempata pelo horário (mais antigo primeiro)
                LIMIT 1
            `, [hoje]);

            const agendamentoAtual = andamentoRes.rows[0] || null;
            const idEmAndamento = agendamentoAtual ? agendamentoAtual.agend_id : 0;

            // --- BLOCO 2: CONSULTAS PARALELAS ---
            const [clientesRes, veiculosHojeRes, faturamentoRes, concluidosRes, proximasRes, graficoRes] = await Promise.all([
                // 1. Total Clientes
                client.query('SELECT COUNT(*) FROM usuarios'),

                // 2. Veículos Hoje (Exclui cancelados status 0)
                client.query('SELECT COUNT(*) FROM agendamentos WHERE agend_data = $1 AND agend_situacao != 0', [hoje]),

                // 3. Faturamento Mês (Considera apenas CONCLUÍDOS status 3)
                // Usando COALESCE para retornar 0 se for null
                client.query(`
                    SELECT COALESCE(SUM(precificacao.media_preco), 0) as total 
                    FROM agenda_servicos ags
                    JOIN agendamentos a ON ags.agend_id = a.agend_id

                    JOIN (
                        SELECT serv_id, AVG(stv_preco) as media_preco
                        FROM servicos_tipo_veiculo
                        GROUP BY serv_id
                    ) precificacao ON ags.serv_id = precificacao.serv_id

                    WHERE TO_CHAR(a.agend_data, 'YYYY-MM') = $1 
                    AND a.agend_situacao = 3
                `, [mesAtual]),

                // 4. Concluídos Mês
                client.query(`
                    SELECT COUNT(*) FROM agendamentos 
                    WHERE TO_CHAR(agend_data, 'YYYY-MM') = $1 AND agend_situacao = 3
                `, [mesAtual]),

                // 5. PRÓXIMAS ENTRADAS
                // Pega o restante da fila (Status 1 ou 2) que NÃO é o que já mostramos acima
                client.query(`
                    SELECT a.agend_horario, a.agend_situacao, v.veic_placa, m.mod_nome, u.usu_nome,
                       (SELECT s.serv_nome FROM servicos s 
                        JOIN agenda_servicos ags ON s.serv_id = ags.serv_id 
                        WHERE ags.agend_id = a.agend_id LIMIT 1) as servico_principal
                    FROM agendamentos a
                    JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
                    JOIN veiculos v ON vu.veic_id = v.veic_id
                    JOIN modelos m ON v.mod_id = m.mod_id
                    JOIN usuarios u ON vu.usu_id = u.usu_id
                    WHERE a.agend_data = $1 
                      AND a.agend_situacao IN (1, 2) -- Pendentes ou Em espera
                      AND a.agend_id != $2           -- Ignora o ID que já está no destaque
                    ORDER BY a.agend_horario ASC
                    LIMIT 4
                `, [hoje, idEmAndamento]),

                // 6. Gráfico (Top 5 Serviços)
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
                    clientes_totais: parseInt(clientesRes.rows[0].count),
                    veiculos_hoje: parseInt(veiculosHojeRes.rows[0].count),
                    faturamento_mes: parseFloat(faturamentoRes.rows[0].total), // Garante número
                    concluidos_mes: parseInt(concluidosRes.rows[0].count)
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