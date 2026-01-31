import pool from '../config/db.js';


export const getAllModels = async (req, res, next) => {
  try {
    const query = `
        SELECT mod_id,
               mod_nome,
               mod_cod,
               mar_cod,
               mar_id
          FROM modelos
      ORDER BY mod_nome ASC;
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


export const getModelsByBrand = async (req, res, next) => {
  try {
    const { mar_id } = req.params;

    const query = `
        SELECT mod_id,
               mod_nome,
               mod_cod,
               mar_cod,
               mar_id
          FROM modelos
         WHERE mar_id = $1
      ORDER BY mod_nome ASC;
    `;

    const result = await pool.query(query, [mar_id]);

    return res.json({
      status: 'success',
      data: result.rows,
      total: result.rowCount
    });

  } catch (error) {
    next(error);
  }
};



export const getModelsByCategoryAndBrand = async (req, res, next) => {
  try {
    const { cat_id, mar_id } = req.params;

    const query = `
          SELECT m.mod_id,
                 m.mod_nome,
                 m.mod_cod,
                 m.mar_id
            FROM modelos AS m
      INNER JOIN marcas   AS ma ON ma.mar_id = m.mar_id
           WHERE ma.cat_id = $1
             AND m.mar_id = $2
           ORDER BY m.mod_nome ASC;
    `;

    const result = await pool.query(query, [cat_id, mar_id]);

    return res.json({
      status: 'success',
      data: result.rows,
      total: result.rowCount
    });

  } catch (error) {
    next(error);
  }
};



export const createModel = async (req, res, next) => {
  try {
    const {
      mod_nome,
      mod_cod,
      mar_cod,
      mar_id
    } = req.body;

    // Validação básica
    if (!mod_nome || !mar_id) {
        return res.status(400).json({ status: 'error', message: 'Nome do modelo e ID da marca são obrigatórios.' });
    }

    const query = `
      INSERT INTO modelos (
        mod_nome,
        mod_cod,
        mar_cod,
        mar_id
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      mod_nome,
      mod_cod,
      mar_cod,
      mar_id
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Modelo cadastrado com sucesso.',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};



export const updateModel = async (req, res, next) => {
  try {
    const { mod_id } = req.params;
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

    const allowedFields = ['mod_nome', 'mod_cod', 'mar_cod', 'mar_id'];

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

    values.push(mod_id);

    const query = `
      UPDATE modelos
         SET ${fields.join(', ')}
       WHERE mod_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Modelo não encontrado.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Modelo atualizado com sucesso.',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};


export const deleteModel = async (req, res, next) => {
  try {
    const { mod_id } = req.params;

    const query = `
      DELETE 
        FROM modelos
       WHERE mod_id = $1
      RETURNING mod_id;
    `;

    const result = await pool.query(query, [mod_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Modelo não encontrado.'
      });
    }

    return res.json({
      status: 'success',
      message: 'Modelo excluído com sucesso.'
    });

  } catch (error) {
    // Tratamento de Foreign Key (Se existirem veículos usando este modelo)
    if (error.code === '23503') {
        return res.status(409).json({
            status: 'error',
            message: 'Não é possível excluir este modelo pois existem veículos vinculados a ele.'
        });
    }
    next(error);
  }
};