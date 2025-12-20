// Controller responsável por validar se a API está online

export const healthCheck = (req, res) => {
  return res.json({
    status: 'ok',
    message: 'API is running'
  });
};
