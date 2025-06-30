import * as CategoryService from '../services/category.services.js';

export const getAll = async (req, res) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const category = await CategoryService.getCategoryById(req.params.id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newCategory = await CategoryService.createCategory(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe una categoría con ese nombre.' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        await CategoryService.deleteCategory(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Categoría no encontrada para eliminar' });
        }
        res.status(500).json({ message: error.message });
    }
};