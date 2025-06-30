import * as ProductService from '../services/product.services.js';

export const getAll = async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newProduct = await ProductService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        await ProductService.deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(500).json({ message: error.message });
    }
};