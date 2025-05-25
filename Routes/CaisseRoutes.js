// Dans le fichier de routes (par exemple, articleRoutes.js)
const express = require("express");
const router = express.Router();

const { 
 createCaisse,
 getAllCaisses,
 caisseByClient
} = require("../Controllers/CaisseController");


router.post("/" ,createCaisse); // Ajouter un nouvel caisse 
router.get('/',getAllCaisses)
router.get('/:clientid',caisseByClient)

module.exports = router;