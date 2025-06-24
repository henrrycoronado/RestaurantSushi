import * as OrderService from '../services/order.services.js';

export const create = async (req, res) => {
    try {
        const userId = req.user.id;
        const { details } = req.body;
        const newOrder = await OrderService.createOrder({ user_id: userId, details });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await OrderService.getOrdersByUserId(req.user.id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRol = req.user.rol;

        const order = await OrderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        if (userRol !== 'admin' && order.user_id !== userId) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateOrderState = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;
        const updatedOrder = await OrderService.updateOrderState(id, state);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};