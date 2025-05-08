const express = require('express');
const router = express.Router();
const {
    createCategorie,
    getCategories,
    getCategorieByID,
    updateCategorie,
    deleteCategorie
} = require('../Controllers/CategorieController');

// Route pour créer une nouvelle catégorie
router.post('/', createCategorie);

// Route pour obtenir toutes les catégories
router.get('/', getCategories);

// Route pour obtenir une catégorie par son ID
router.get('/:id', getCategorieByID);

// Route pour mettre à jour une catégorie
router.put('/:id', updateCategorie);

// Route pour supprimer une catégorie
router.delete('/:id', deleteCategorie);

module.exports = router;
