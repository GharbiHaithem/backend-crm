const Client = require('../Models/Client'); // Assurez-vous que le chemin est correct

// Récupérer tous les clients
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
}; 
// Récupérer un client par ID
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Ajouter un nouveau client
exports.createClient = async (req, res) => {
    const { nom_prenom, telephone, code, raison_social, matricule_fiscale, adresse, register_commerce, solde_initial, montant_raprochement, code_rapprochement, rapeBl, solde_initiale_bl, montant_reglement_bl, taux_retenu } = req.body;
    try {
        const newClient = new Client({
            nom_prenom,
            telephone,
            code,
            raison_social,
            matricule_fiscale,
            adresse,
            register_commerce,
            solde_initial,
            montant_raprochement,
            code_rapprochement,
            rapeBl,
            solde_initiale_bl,
            montant_reglement_bl,
            taux_retenu
        });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
// Mettre à jour un client par ID
exports.updateClient = async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Supprimer un client par ID
exports.deleteClient = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.status(200).json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Récupérer des clients avec recherche et pagination
exports.getClients = async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    try {
        const clients = await Client.find(filters)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Client.countDocuments(filters);
        res.status(200).json({
            clients,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.searchClient = async(req,res)=>{
    const{query} = req.query
    if(!query){
        return res.status(400).json("parametre de recherche requis")
    }
    try {
        const results=await Client.find({
            $or:[
                {nom_prenom:{$regex:query,$options:'i'}},
                {code:{$regex:query,$options:'i'}}
            ]
        })
        res.status(200).json(results)
    } catch (error) {
         res.status(500).json({ message: 'Erreur serveur', error }); 
    }
}
// Récupérer un client par son code
exports.getClientByCode = async (req, res) => {
    try {
        const client = await Client.findOne({ code: req.params.code });
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};