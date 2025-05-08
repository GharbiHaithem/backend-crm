const express = require('express');
const router = express.Router();
const {
    createFacture,getAllFactures,getFactureById,deleteFacture
   
} = require('../Controllers/FactureController');

// Route pour créer une nouvelle facture client
router.post('/create', createFacture);

router.get('/all', getAllFactures);

router.get('/:id', getFactureById);
router.delete('/:id', deleteFacture);

module.exports = router;
