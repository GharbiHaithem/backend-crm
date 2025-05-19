const express = require("express");
const router = express.Router();
const enteteController = require("../Controllers/enteteController");
const Entete= require('../Models/Entete')
// Créer un devis
router.post("/devis", enteteController.create);
router.post('/verifyNumero', async (req, res) => {
    try {
        const { numero } = req.body;

        // Validation de l'entrée
        if (!numero) {
            return res.status(400).json({
                success: false,
                message: "Le numero est requis"
            });
        }

        // Recherche du client
        const entete = await Entete.findOne({ numero });

        if (entete) {
            return res.status(404).json({
                success: false,
                message: "Numero reservé pour autre devis"
            });
        }

        // Réponse réussie
        return res.status(200).json({
            success: true,
            message: 'Numero verified',
          
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
// GET /users?code=12345
// GET /entetes?code=CL123
router.get('/searchFilter', async (req, res) => {
  const { code, typeDocument, date } = req.query;

  if (!typeDocument) {
    return res.status(400).json({ error: 'Le champ typeDocument est requis.' });
  }

  // Initialisation du filtre
  const filters = { typeDocument };

  // Ajout conditionnel de la date
if (date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // début du jour (00:00:00)
  
  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // fin du jour (23:59:59.999)

  filters.date = { $gte: start, $lte: end };
}

  try {
    let entetes;

    if (code) {
      // Si code présent : filtrer client avec populate
      entetes = await Entete.find(filters)
        .populate({
          path: 'client',
          match: { code: { $regex: code, $options: 'i' } }
        })
        .exec();

      // Garder uniquement les entêtes dont le client correspond
      entetes = entetes.filter(e => e.client !== null);

    } else if (date) {
      // Si pas de code mais date présente : recherche sans filtrer client
      entetes = await Entete.find(filters).populate('client').exec();
    } else {
      // Ni code ni date → refus
      return res.status(400).json({ error: 'Veuillez fournir soit un code client, soit une date.' });
    }

    res.json(entetes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// donnee le soum de document selon le type et date
router.get(
  "/total/:typeDocument/:year",
  enteteController.getTotalByTypeDocument
);

//  Consulter tous les documents par type
router.get("", enteteController.getDocuments);

//  Voir les détails d’un document
router.get("/:id", enteteController.getDocumentById);

//  Éditer un document

// Supprimer un document
router.delete("/:id", enteteController.deleteDocument);

// Télécharger un document en PDF
router.get("/:id/pdf", enteteController.downloadDocumentPDF);
router.put("/devis", enteteController.updateDocument);
module.exports = router;
