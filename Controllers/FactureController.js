const Facture = require('../Models/Facture');

// Créer une nouvelle catégorie
const createFacture = async (req, res) => {


    try {
      const count=await Facture.countDocuments();
      const numero=`FACT-${String(count+1).padStart(3,'0')}`
      console.log(numero)
        const newFacture = new Facture(
          {...req.body,numFacture:numero}

        );
        const totalHT = newFacture.lignes.reduce((acc, ligne) => {
  return acc + ligne.prixHT * ligne.quantite;
}, 0);
        console.log(totalHT);
         newFacture.resteAPayer=totalHT
        await newFacture.save();
        res.status(201).json(newFacture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFactures= async(req,res)=>{
  try {
    const factures = await Facture.find().populate('client')
    console.log(factures)
    res.status(201).json(factures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getFactureById= async(req,res)=>{
  try {
    const {id} = req.params
    const facture = await Facture.findById(id).populate('client')
    res.status(201).json(facture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteFacture = async(req,res)=>{
    try {
    const {id} = req.params
    const facture = await Facture.findByIdAndDelete(id).populate('client')
    res.status(201).json(facture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const searchFacture = async(req,res)=>{
    const{query} = req.query
    if(!query){
        return res.status(400).json("parametre de recherche requis")
    }
   const results = await Facture.find({
      $or: [
        { numFacture: { $regex: query, $options: 'i' } },
        { 
          'client.nom_prenom': { $regex: query, $options: 'i' } 
          // Si la référence est un ObjectId peuplé
        }
      ]
    })
}
// const payerFactures = async (req, res) => {
//   try {
//     const { factureIds, montant } = req.body;
//     console.log(req.body);
//     let montantRestant = montant;

//     // Récupérer les factures dans l'ordre de création
//     const factures = await Facture.find({ _id: { $in: factureIds } }).sort({ createdAt: 1 });
//     if (!factures.length) return res.status(404).json({ message: "Aucune facture trouvée." });

//     // Étape 1 : Calculer le montant total à payer (somme des restes à payer)
//     const totalRestantFactures = factures.reduce((somme, facture) => {
//       const dejaPayé = facture.montantPayé || 0;
//       const total = facture.totalHT;
//       return somme + (total - dejaPayé);
//     }, 0);

//     // Étape 2 : Si le montant est trop grand, on peut afficher un message ou ajuster
//     if (montant > totalRestantFactures) {
//       return res.status(400).json({
//         message: `Le montant introduit (${montant} DT) dépasse le total à payer (${totalRestantFactures} DT).`,
//       });
//     }

//     // Étape 3 : Répartition du montant
//     const updates = [];

//     for (const facture of factures) {
//       if (montantRestant <= 0) break;

//       const dejaPayé = facture.montantPayé || 0;
//       const total = facture.totalHT;
//       const reste = total - dejaPayé;

//       const paiementPourFacture = Math.min(montantRestant, reste);

//       facture.montantPayé = dejaPayé + paiementPourFacture;
//       facture.resteAPayer = total - facture.montantPayé;
//       facture.status = facture.resteAPayer === 0
//         ? 'paid'
//         : (facture.montantPayé > 0 ? 'partial' : 'unpaid');

//       montantRestant -= paiementPourFacture;
//       updates.push(facture.save());
//     }

//     await Promise.all(updates);
//     res.status(200).json({ message: "Paiement appliqué aux factures avec succès." });

//   } catch (error) {
//     console.error("Erreur paiement :", error);
//     res.status(500).json({ message: "Erreur serveur." });
//   }
// };

const payerFactures = async (req, res) => {
  try {
    const { factureIds, montant } = req.body;
    let montantRestant = montant;

    const factures = await Facture.find({ _id: { $in: factureIds } }).sort({ createdAt: 1 });
    if (!factures.length) return res.status(404).json({ message: "Aucune facture trouvée." });

    const totalRestantFactures = factures.reduce((somme, facture) => {
      const dejaPayé = facture.montantPayé || 0;
      const total = facture.totalHT;
      return somme + (total - dejaPayé);
    }, 0);

    if (montant > totalRestantFactures) {
      return res.status(400).json({
        message: `Le montant introduit (${montant} DT) dépasse le total à payer (${totalRestantFactures} DT).`,
      });
    }

    const updates = [];
    const partiellementPayables = [];

    // Étape 1 : Payer totalement les factures possibles
    for (const facture of factures) {
      if (montantRestant <= 0) break;

      const dejaPayé = facture.montantPayé || 0;
      const total = facture.totalHT;
      const reste = total - dejaPayé;

      if (montantRestant >= reste) {
        facture.montantPayé = total;
        facture.resteAPayer = 0;
        facture.status = 'paid';
        montantRestant -= reste;
        updates.push(facture.save());
      } else {
        // Facture incomplète, on la garde pour la 2e étape
        partiellementPayables.push({ facture, dejaPayé, reste });
      }
    }

    // Étape 2 : Répartir équitablement le reste sur les factures incomplètes
    const n = partiellementPayables.length;
    if (montantRestant > 0 && n > 0) {
      const montantParFacture = montantRestant / n;
      for (const item of partiellementPayables) {
        const { facture, dejaPayé, reste } = item;
        const paiement = Math.min(montantParFacture, reste);

        facture.montantPayé = dejaPayé + paiement;
        facture.resteAPayer = facture.totalHT - facture.montantPayé;
        facture.status = facture.resteAPayer === 0 ? 'paid' : 'partial';

        updates.push(facture.save());
      }
    }

    await Promise.all(updates);
    res.status(200).json({ message: "Paiement réparti entre les factures avec succès."});

  } catch (error) {
    console.error("Erreur paiement :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
      createFacture,getAllFactures,getFactureById,deleteFacture,searchFacture,payerFactures

};
