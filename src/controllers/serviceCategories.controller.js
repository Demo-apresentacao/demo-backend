import pool from '../config/db.js';

/**
 * Lista todas as categorias de serviços
 * GET /service-categories
 */
export const listServiceCategories = async (req, res, next) => {
    try {
        // 👇 AQUI: Adicionei cat_serv_situacao na query
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

// POST /service-categories
export const createServiceCategory = async (req, res, next) => {
    try {
        const { cat_serv_nome } = req.body;
        
        if (!cat_serv_nome) return res.status(400).json({ message: "Nome da categoria é obrigatório" });

        const result = await pool.query(
            `INSERT INTO categorias_servicos (cat_serv_nome) VALUES ($1) RETURNING *`,
            [cat_serv_nome]
        );

        return res.status(201).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

// PUT /service-categories/:id
export const updateServiceCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Agora aceitamos também o cat_serv_situacao
        const { cat_serv_nome, cat_serv_situacao } = req.body;

        const result = await pool.query(
            `UPDATE categorias_servicos 
             SET cat_serv_nome = $1, cat_serv_situacao = $2 
             WHERE cat_serv_id = $3 
             RETURNING *`,
            [cat_serv_nome, cat_serv_situacao, id]
        );

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
      WHERE cat_serv_id = $1;
    `;

    await pool.query(query, [id]);

    return res.json({
      status: 'success',
      message: `Categoria ${id} removida com sucesso.`
    });
  } catch (error) {
    next(error);
  }
};