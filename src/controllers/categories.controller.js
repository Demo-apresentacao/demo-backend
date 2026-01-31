import pool from '../config/db.js';


export const listCategories = async (req, res, next) => {
  try {
    const query = `
        SELECT cat_id,
               cat_nome,
               cat_icone
          FROM categorias
      ORDER BY cat_nome ASC;
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


export const createCategory = async (req, res, next) => {
  try {
    const { cat_nome, cat_icone } = req.body;

    if (!cat_nome) {
        return res.status(400).json({ status: 'error', message: 'O nome da categoria é obrigatório.' });
    }

    const query = `
      INSERT INTO categorias (cat_nome, cat_icone)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [cat_nome, cat_icone];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Categoria cadastrada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};



export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verifica se enviou algum dado
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum campo fornecido para atualização.'
      });
    }

    
    const fields = [];
    const values = [];
    let index = 1;

    const allowedFields = ['cat_nome', 'cat_icone'];

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

    values.push(id);

    const query = `
      UPDATE categorias
         SET ${fields.join(', ')}
       WHERE cat_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Categoria atualizada com sucesso.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};


export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE 
        FROM categorias
       WHERE cat_id = $1
      RETURNING cat_id;
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Categoria removida com sucesso.'
    });
  } catch (error) {
    
    if (error.code === '23503') {
        return res.status(409).json({
            status: 'error',
            message: 'Não é possível excluir esta categoria pois existem itens vinculados a ela.'
        });
    }
    next(error);
  }
};