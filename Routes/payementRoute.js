const express = require('express');
const router = express.Router();
const {
    creatModePayement,getMethodeWithFactures
  
} = require('../Controllers/ModePayement');

// Route pour créer une nouvelle famille
router.post('/', creatModePayement);
router.get('/:factureId', getMethodeWithFactures);


module.exports = router;
