import pool from '../config/db.js';

/**
 * Lista todas as categorias de serviços
 * GET /service-categories
 */
export const listServiceCategories = async (req, res, next) => {
    try {
        const query = `
            SELECT cat_serv_id, cat_serv_nome, cat_serv_situacao 
            FROM categorias_servicos 
            ORDER BY cat_serv_nome ASC
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

/**
 * Cadastra uma nova categoria de serviço
 * POST /service-categories
 */
export const createServiceCategory = async (req, res, next) => {
    try {
        const { cat_serv_nome } = req.body;
        
        if (!cat_serv_nome) {
            return res.status(400).json({ status: 'error', message: "Nome da categoria é obrigatório" });
        }

        // Define true como padrão para situação se não for enviado
        const result = await pool.query(
            `INSERT INTO categorias_servicos (cat_serv_nome, cat_serv_situacao) VALUES ($1, true) RETURNING *`,
            [cat_serv_nome]
        );

        return res.status(201).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

/**
 * Atualiza uma categoria de serviço (PATCH Dinâmico)
 * PATCH /service-categories/:id
 */
export const updateServiceCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // 1. Verifica se enviou algum dado
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Nenhum campo fornecido para atualização.'
            });
        }

        // 2. Montagem Dinâmica da Query
        const fields = [];
        const values = [];
        let index = 1;

        // Campos permitidos para alteração
        const allowedFields = ['cat_serv_nome', 'cat_serv_situacao'];

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

        // Adiciona o ID ao final dos valores
        values.push(id);

        const query = `
            UPDATE categorias_servicos 
            SET ${fields.join(', ')} 
            WHERE cat_serv_id = $${index} 
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ status: 'error', message: "Categoria não encontrada" });
        }

        return res.json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove uma categoria de serviço
 * DELETE /service-categories/:id
 */
export const deleteServiceCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM categorias_servicos
            WHERE cat_serv_id = $1
            RETURNING cat_serv_id;
        `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ status: 'error', message: "Categoria não encontrada" });
        }

        return res.json({
            status: 'success',
            message: `Categoria ${id} removida com sucesso.`
        });
    } catch (error) {
        // Tratamento para Foreign Key (Erro 23503)
        // Impede apagar categoria se houver serviços vinculados a ela
        if (error.code === '23503') {
            return res.status(409).json({
                status: 'error',
                message: 'Não é possível excluir esta categoria pois existem serviços vinculados a ela.'
            });
        }
        next(error);
    }
};