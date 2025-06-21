import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client.js';

export const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await prisma.users.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    rol: true,
                },
            });
            if (!req.user) {
                return res.status(401).json({ message: 'Usuario no encontrado.' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'No autorizado, token inválido.' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no se proporcionó un token.' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};