// Ajouter un nouveau client
const Caisse = require('../Models/Caisse')
exports.createCaisse = async (req, res) => {
    
    try {
        const newCaisse = new Caisse(
          req.body
        );
        await newCaisse.save();
        res.status(201).json(newCaisse);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
// Mettre à jour un client par ID
exports.updateCaisse = async (req, res) => {
    try {
        const updatedCaisse = await Caisse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCaisse) {
            return res.status(404).json({ message: 'Caisse non trouvé' });
        }
        res.status(200).json(updatedCaisse);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
exports.getAllCaisses= async(req,res)=>{
    try {
        const caisses = await Caisse.find().populate('client')
        if(caisses.length==0){
               res.status(204).json({message:'Aucun caisse n/et trouve'})
        }
       return res.status(200).json(caisses)
     } catch (error) {
           res.status(500).json({ message: 'Erreur serveur', error });
    }
}
exports.caisseByClient= async(req,res)=>{
    try {
        const {clientid} = req.params
        const caisse = await Caisse.find({client:clientid}).populate('client')
            res.status(201).json(caisse)
    } catch (error) {
          res.status(500).json({ message: 'Erreur serveur', error });
    }
}