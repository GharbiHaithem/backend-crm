const Client = require('../Models/Client'); // Assurez-vous que le chemin est correct
const Facture = require('../Models/Facture'); 
const Entete = require('../Models/Entete'); 
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
        const client = await Client.findOne({code})
        if(client){
          return   res.status(409).json({message:"code client existe déja essayer un autre code"})
        }
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
  const { id } = req.params;

  try {
    // Vérifier s'il a des factures non payées (reste à payer > 0)
    const factureImpayee = await Facture.findOne({
      client: id,
      resteAPayer: { $gt: 0 }
    });

    if (factureImpayee) {
      return res.status(400).json({
        success: false,
        message: "Ce client a des factures non payées. Suppression interdite."
      });
    }

    // Vérifier s’il a des entêtes
    const enteteExist = await Entete.findOne({ client: id });

    if (enteteExist) {
      return res.status(400).json({
        success: false,
        message: "Ce client a des documents liés (entêtes). Suppression interdite."
      });
    }

    // Si aucune facture impayée et pas d'entête : suppression
    const deleted = await Client.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Client introuvable."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client supprimé avec succès."
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression du client."
    });
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