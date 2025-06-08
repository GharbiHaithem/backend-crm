const express = require('express');
const router = express.Router();
const {
    createFacture,getAllFactures,getFactureById,deleteFacture,searchFacture,payerFactures,
    getMostUsedArticle,getTotalResteAPayerDepuisDate,getTotalPayeDepuisDate
   
} = require('../Controllers/FactureController');
const Facture = require('../Models/Facture');

// Route pour créer une nouvelle facture client
router.post('/create', createFacture);
router.post('/payer', payerFactures);
router.get('/getTotalAmount' , getTotalResteAPayerDepuisDate)
router.get('/getTotalPayedAmount' , getTotalPayeDepuisDate)
router.get('/factureFiltrer', async (req, res) => {
  const { clientid, date } = req.query;



  // Initialisation du filtre
  const filters = {  };

  // Ajout conditionnel de la date
if (date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // début du jour (00:00:00)
  
  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // fin du jour (23:59:59.999)

  filters.date = { $gte: start, $lte: end };
}

  try {
    let facture;

    if (clientid) {
      // Si code présent : filtrer client avec populate
      filters.client =clientid
      facture = await Facture.find(filters)
        .populate('client')
        .exec();

      // Garder uniquement les entêtes dont le client correspond
      facture = facture.filter(e => e.client !== null);

    } else if (date) {
      // Si pas de code mais date présente : recherche sans filtrer client
      facture = await Facture.find(filters).populate('client').exec();
    } else {
      // Ni code ni date → refus
      return res.status(400).json({ error: 'Veuillez fournir soit un code client, soit une date.' });
    }

    res.json(facture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.get('/most-used-article', getMostUsedArticle);
router.get('/all', getAllFactures);
router.get('/search', searchFacture);

router.get('/:id', getFactureById);

router.delete('/:id', deleteFacture);
router.get('/factureFiltrer', async (req, res) => {
  const { clientid, date } = req.query;



  // Initialisation du filtre
  const filters = {  };

  // Ajout conditionnel de la date
if (date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // début du jour (00:00:00)
  
  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // fin du jour (23:59:59.999)

  filters.date = { $gte: start, $lte: end };
}

  try {
    let facture;

    if (clientid) {
      // Si code présent : filtrer client avec populate
      facture = await Facture.find(filters)
        .populate({
          path: 'client',
          match: { _id: { $regex: clientid, $options: 'i' } }
        })
        .exec();

      // Garder uniquement les entêtes dont le client correspond
      facture = facture.filter(e => e.client !== null);

    } else if (date) {
      // Si pas de code mais date présente : recherche sans filtrer client
      facture = await Facture.find(filters).populate('client').exec();
    } else {
      // Ni code ni date → refus
      return res.status(400).json({ error: 'Veuillez fournir soit un code client, soit une date.' });
    }

    res.json(facture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
