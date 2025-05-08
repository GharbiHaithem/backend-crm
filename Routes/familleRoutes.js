const express = require('express');
const router = express.Router();
const {
    createFamille,
    getFamilles,
    getFamilleByID,
    updateFamille,
    deleteFamille
} = require('../Controllers/FamilleController');

// Route pour créer une nouvelle famille
router.post('/', createFamille);

// Route pour obtenir toutes les familles
router.get('/', getFamilles);

// Route pour obtenir une famille par son ID
router.get('/:id', getFamilleByID);

// Route pour mettre à jour une famille
router.put('/:id', updateFamille);

// Route pour supprimer une famille
router.delete('/:id', deleteFamille);

module.exports = router;
