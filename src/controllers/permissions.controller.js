import pool from "../config/db.js";

/**
 * ==========================================
 * 1. LISTAR TODAS AS PERMISSÕES (Catálogo)
 * ==========================================
 */
export const getAllPermissions = async (req, res, next) => {
    try {
        const query = `
               SELECT per_id,
                     per_chave,
                     per_descricao
                FROM permissoes
            ORDER BY per_chave ASC;
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
 * ==========================================
 * 2. BUSCAR PERMISSÕES DE UM USUÁRIO ESPECÍFICO
 * ==========================================
 * Retorna apenas as chaves (ex: ['usuarios.listar', 'veiculos.criar'])
 * que o usuário possui. O Front-end usa isso para ligar os Toggles.
 */
export const getUserPermissions = async (req, res, next) => {
    const { id } = req.params; // ID do usuário

    try {
        const query = `
                SELECT p.per_chave 
                  FROM permissoes AS p
            INNER JOIN usuario_permissoes AS up ON p.per_id = up.per_id
                 WHERE up.usu_id = $1;
        `;

        const result = await pool.query(query, [id]);

        // Extrai apenas as chaves para um array de strings simples
        const permissoesUsuario = result.rows.map(row => row.per_chave);

        return res.json({
            status: 'success',
            data: permissoesUsuario
        });

    } catch (error) {
        next(error);
    }
};

/**
 * ==========================================
 * 3. ATUALIZAR (SINCRONIZAR) PERMISSÕES DO USUÁRIO
 * ==========================================
 * Recebe o ID do usuário e um array com TODAS as permissões ativas.
 * Usa a estratégia "Limpa e Recria" dentro de uma Transação.
 */
export const updateUserPermissions = async (req, res, next) => {
    const { id } = req.params; // ID do usuário
    const { permissions } = req.body; // Array de strings: ['usuarios.listar', 'usuarios.criar', ...]

    // Abre uma conexão exclusiva para a transação
    const client = await pool.connect();

    try {
        // Inicia a transação (Se der erro no meio, ele desfaz tudo)
        await client.query('BEGIN');

        // PASSO 1: Deletar todas as permissões atuais do usuário
        await client.query('DELETE FROM usuario_permissoes WHERE usu_id = $1', [id]);

        // PASSO 2: Inserir as novas permissões (se o array não estiver vazio)
        if (permissions && permissions.length > 0) {
            // Truque de mestre: Usamos o ANY($2) para buscar os IDs das chaves enviadas
            // e inserir de uma vez só, sem precisar de loops no JavaScript.
            const insertQuery = `
                INSERT INTO usuario_permissoes (usu_id, per_id)
                     SELECT $1, per_id 
                       FROM permissoes 
                      WHERE per_chave = ANY($2::text[])
        `;
            await client.query(insertQuery, [id, permissions]);
        }

        // PASSO 3: Confirma a transação
        await client.query('COMMIT');

        return res.json({
            status: 'success',
            message: 'Permissões atualizadas com sucesso!'
        });

    } catch (error) {
        // Se deu erro, cancela tudo e volta como estava
        await client.query('ROLLBACK');
        next(error);
    } finally {
        // Libera a conexão de volta para o pool (MUITO IMPORTANTE)
        client.release();
    }
};