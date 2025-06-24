import * as PublicationService from '../services/publication.services.js';
import * as LikeService from '../services/publicationLikes.services.js';


export const getAll = async (req, res) => {
    try {
        const publications = await PublicationService.getAllPublications();
        res.status(200).json(publications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const publication = await PublicationService.getPublicationById(req.params.id);
        if (!publication) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.status(200).json(publication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const publicationData = { ...req.body, user_id: req.user.id };
        const newPublication = await PublicationService.createPublication(publicationData);
        res.status(201).json(newPublication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const update = async (req, res) => {
    try {
        const publicationId = req.params.id;
        const userId = req.user.id;
        const dataToUpdate = req.body;

        const publication = await PublicationService.getPublicationById(publicationId);
        if (!publication) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        if (publication.user_id !== userId && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. No eres el autor de esta publicación.' });
        }

        const updatedPublication = await PublicationService.updatePublication(publicationId, dataToUpdate);
        res.status(200).json(updatedPublication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const publicationId = req.params.id;
        const userId = req.user.id;

        const publication = await PublicationService.getPublicationById(publicationId);
        if (!publication) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        if (publication.user_id !== userId && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. No eres el autor de esta publicación.' });
        }

        await PublicationService.deletePublication(publicationId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const like = async (req, res) => {
    try {
        const userId = req.user.id;
        const { publicationId } = req.params;
        await LikeService.likePublication(userId, publicationId);
        res.status(201).json({ message: 'Like añadido con éxito' });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya has dado like a esta publicación' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const unlike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { publicationId } = req.params;
        await LikeService.unlikePublication(userId, publicationId);
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'No se encontró un like para remover' });
        }
        res.status(500).json({ message: error.message });
    }
};