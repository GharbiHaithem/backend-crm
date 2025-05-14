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

module.exports = {
      createFacture,getAllFactures,getFactureById,deleteFacture,searchFacture

};
