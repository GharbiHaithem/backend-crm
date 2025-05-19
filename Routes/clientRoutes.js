const express = require('express');
const router = express.Router();
const clientController = require('../Controllers/clientController');
const Client = require('../Models/Client')
router.post('/verifyCode', async (req, res) => {
    try {
        const { code } = req.body;

        // Validation de l'entrée
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Le code est requis"
            });
        }

        // Recherche du client
        const user = await Client.findOne({ code });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Client non trouvé"
            });
        }

        // Réponse réussie
        return res.status(200).json({
            success: true,
            message: 'Client vérifié',
            data: {
                id: user._id,
                nom: user.name,
                email: user.email
                // Ajouter d'autres champs utiles
            }
        });

    } catch (error) {
        console.error('Erreur verification code:', error);
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'production' 
                ? "Erreur serveur" 
                : error.message
        });
    }
});
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