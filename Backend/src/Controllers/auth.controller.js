import { prisma } from '../prisma/client.js';
import { hashPassword, comparePassword } from '../utils/hash.utils.js';
import { generateToken } from '../utils/token.utils.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const userResponse = { ...user };
        delete userResponse.password;
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: userResponse });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor - register', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const token = generateToken({ id: user.id });
        const userResponse = { ...user };
        delete userResponse.password;
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: userResponse,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor - logIn', error: error.message });
    }
};