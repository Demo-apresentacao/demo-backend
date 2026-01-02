import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // O token deve estar no formato "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Adiciona os dados do usuário (id, acesso) na requisição
        next(); // Passa para o próximo controller (ex: rota de listar produtos)
    } catch (err) {
        res.status(400).json({ status: 'error', message: 'Token inválido ou expirado.' });
    }
}