const express = require('express');
const router = express.Router();
const clientController = require('../Controllers/clientController');

// Récupérer tous les clients
router.get('/all', clientController.getAllClients);
// Récupérer client by query (search )
router.get('/search', clientController.searchClient);
// Récupérer un client par ID
router.get('/:id', clientController.getClientById);

// Ajouter un nouveau client
router.post('/', clientController.createClient);

// Mettre à jour un client par ID
router.put('/:id', clientController.updateClient);

// Supprimer un client par ID
router.delete('/:id', clientController.deleteClient);

// Récupérer des clients avec recherche et pagination
router.get('/', clientController.getClients);

// Récupérer un client par son code
router.get('/code/:code', clientController.getClientByCode);

module.exports = router;