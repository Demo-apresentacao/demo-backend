import pool from '../config/db.js';

// Função para obter categorias de veículos e serviços associadas
export const getCategoriesVehiclesForServices = async (req, res) => {
  try {
    const query = `
        SELECT tps.tps_id,
               tps.tps_nome,
               tps.tps_situacao
          FROM tipo_veiculo_servico AS tps
      ORDER BY tps.tps_nome ASC
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      status: 'success',
      data: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao obter categorias de veículos para serviços:', error);
    return res.status(500).json({
        status: 'error',
        message: 'Erro ao obter categorias de veículos para serviços.'
    });
  }
};