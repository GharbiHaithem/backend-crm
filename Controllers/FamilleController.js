const Famille = require('../Models/Famille');

// Créer une nouvelle famille
const createFamille = async (req, res) => {
    const { codeFamille, designationFamille } = req.body;
    console.log(req.body)

    try {
        const newFamille = new Famille({
            codeFamille,
            designationFamille
        });
        await newFamille.save();
        res.status(201).json(newFamille);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les familles
const getFamilles = async (req, res) => {
    try {
        const familles = await Famille.find();
        res.status(200).json(familles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une famille par ID
const getFamilleByID = async (req, res) => {
    const { id } = req.params;

    try {
        const famille = await Famille.findById(id);
        if (!famille) {
            return res.status(404).json({ message: 'Famille non trouvée' });
        }
        res.status(200).json(famille);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une famille
const updateFamille = async (req, res) => {
    const { id } = req.params;
    const { designationFamille } = req.body;

    try {
        const updatedFamille = await Famille.findByIdAndUpdate(
            id,
            { designationFamille },
            { new: true }
        );

        if (!updatedFamille) {
            return res.status(404).json({ message: 'Famille non trouvée' });
        }

        res.status(200).json(updatedFamille);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une famille
const deleteFamille = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFamille = await Famille.findByIdAndDelete(id);

        if (!deletedFamille) {
            return res.status(404).json({ message: 'Famille non trouvée' });
        }

        res.status(200).json({ message: 'Famille supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFamille,
    getFamilles,
    getFamilleByID,
    updateFamille,
    deleteFamille
};
