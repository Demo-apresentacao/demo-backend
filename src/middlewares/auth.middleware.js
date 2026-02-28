import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Acesso negado. Token não fornecido.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 aqui garantimos um padrão
    req.user = {
      id: decoded.usu_id
    };

    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado.'
    });
  }
};