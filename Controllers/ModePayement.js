// Ajouter un nouveau client
const ModePayement = require('../Models/ModePayement')
exports.creatModePayement = async (req, res) => {
    
    try {
        const newPayement = new ModePayement(
          req.body
        );
        await newPayement.save();
        res.status(201).json(newPayement);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
exports.getMethodeWithFactures = async (req, res) => {
  const { factureId } = req.params;

  try {
    const modePayement = await ModePayement.find({
      facture: { $in: [factureId] },
    }).populate({
      path: 'facture',
      populate: { path: 'client' },
    });
console.log({modePayement})
    if (!modePayement || modePayement.length === 0) {
      return res.status(404).json({ message: 'Aucun mode de paiement trouvé pour cette facture.' });
    }

    // Garder uniquement la facture correspondante dans chaque mode de paiement
  

    res.status(200).json(modePayement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

