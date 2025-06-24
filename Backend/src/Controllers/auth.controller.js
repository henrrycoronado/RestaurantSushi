import * as UserService from '../services/user.services.js'; 
import { hashPassword, comparePassword } from '../utils/hash.utils.js';
import { generateToken } from '../utils/token.utils.js';

export const register = async (req, res) => {
    const { name, email, password, rol } = req.body;
    try {
        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await UserService.createUser({
            name,
            email,
            password: hashedPassword,
            rol,
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor al registrar', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const token = generateToken({ id: user.id, rol: user.rol });
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            rol: user.rol,
        };
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: userResponse,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
    }
};