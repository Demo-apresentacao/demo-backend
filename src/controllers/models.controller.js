import db from '../config/db.js';

export default {

  // Lista todos os modelos
  async getAllModels(request, response) {
    try {
      const sql = `
        SELECT
          mod_id,
          mod_nome,
          mod_cod,
          mar_cod,
          mar_id
        FROM modelos
        ORDER BY mod_nome
      `;

      const { rows } = await db.query(sql);

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de modelos.',
        dados: rows,
        nItens: rows.length
      });

    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar modelos.',
        erro: error.message
      });
    }
  },

  // Lista modelos por marca
  async getModelsByBrand(request, response) {
    try {
      const { mar_id } = request.params;

      const sql = `
        SELECT
          mod_id,
          mod_nome,
          mod_cod,
          mar_cod,
          mar_id
        FROM modelos
        WHERE mar_id = $1
        ORDER BY mod_nome
      `;

      const { rows } = await db.query(sql, [mar_id]);

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de modelos por marca.',
        dados: rows,
        nItens: rows.length
      });

    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar modelos por marca.',
        erro: error.message
      });
    }
  },

  // Lista modelos por categoria e marca
  async getModelsByCategoryAndBrand(request, response) {
    try {
      const { cat_id, mar_id } = request.params;

      const sql = `
        SELECT
          m.mod_id,
          m.mod_nome,
          m.mod_cod,
          m.mar_id
        FROM modelos m
        INNER JOIN marcas ma ON ma.mar_id = m.mar_id
        WHERE ma.cat_id = $1
          AND m.mar_id = $2
        ORDER BY m.mod_nome
      `;

      const { rows } = await db.query(sql, [cat_id, mar_id]);

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Lista de modelos por categoria e marca.',
        dados: rows,
        nItens: rows.length
      });

    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar modelos por categoria e marca.',
        erro: error.message
      });
    }
  },

  // Cadastra um novo modelo
  async createModel(request, response) {
    try {
      const {
        mod_nome,
        mod_cod,
        mar_cod,
        mar_id
      } = request.body;

      const sql = `
        INSERT INTO modelos (
          mod_nome,
          mod_cod,
          mar_cod,
          mar_id
        ) VALUES ($1, $2, $3, $4)
        RETURNING mod_id
      `;

      const values = [
        mod_nome,
        mod_cod,
        mar_cod,
        mar_id
      ];

      const { rows } = await db.query(sql, values);

      return response.status(201).json({
        sucesso: true,
        mensagem: 'Modelo cadastrado com sucesso.',
        dados: rows[0].mod_id
      });

    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao cadastrar modelo.',
        erro: error.message
      });
    }
  },

  // Edita um modelo
  async updateModel(request, response) {
    try {
      const { mod_id } = request.params;
      const {
        mod_nome,
        mod_cod,
        mar_cod,
        mar_id
      } = request.body;

      const sql = `
        UPDATE modelos
           SET mod_nome = $1,
               mod_cod  = $2,
               mar_cod  = $3,
               mar_id   = $4
         WHERE mod_id = $5
      `;

      const values = [
        mod_nome,
        mod_cod,
        mar_cod,
        mar_id,
        mod_id
      ];

      const result = await db.query(sql, values);

      return response.status(200).json({
        sucesso: true,
        mensagem: `Modelo ${mod_id} atualizado com sucesso.`,
        dados: result.rowCount
      });

    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao atualizar modelo.',
        erro: error.message
      });
    }
  },

  // Exclui um modelo
  async deleteModel(request, response) {
    try {
      const { mod_id } = request.params;

      const sql = `
        DELETE FROM modelos
        WHERE mod_id = $1
      `;

      const result = await db.query(sql, [mod_id]);

      return response.status(200).json({
        sucesso: true,
        mensagem: `Modelo ${mod_id} excluído com sucesso.`,
        dados: result.rowCount
      });

    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao excluir modelo.',
        erro: error.message
      });
    }
  }
};