const Categorie = require('../Models/Categorie');

// Créer une nouvelle catégorie
const createCategorie = async (req, res) => {
    const { codeCategorie, designationCategorie } = req.body;

    try {
        const newCategorie = new Categorie({
            codeCategorie ,
            designationCategorie
        });
        await newCategorie.save();
        res.status(201).json(newCategorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les catégories
const getCategories = async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une catégorie par ID
const getCategorieByID = async (req, res) => {
    const { id } = req.params;

    try {
        const categorie = await Categorie.findById(id);
        if (!categorie) {
            return res.status(404).json({ message: 'Categorie non trouvée' });
        }
        
        res.status(200).json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une catégorie
const updateCategorie = async (req, res) => {
    const { id } = req.params;
    const { designationCategorie , codeCategorie} = req.body;

    try {
        const updatedCategorie = await Categorie.findByIdAndUpdate(
            id,
            { designationCategorie , codeCategorie},
            { new: true }
        );

        if (!updatedCategorie) {
            return res.status(404).json({ message: 'Categorie non trouvée' });
        }

        res.status(200).json(updatedCategorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une catégorie
const deleteCategorie = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategorie = await Categorie.findByIdAndDelete(id);

        if (!deletedCategorie) {
            return res.status(404).json({ message: 'Categorie non trouvée' });
        }

        res.status(200).json({ message: 'Categorie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategorie,
    getCategories,
    getCategorieByID,
    updateCategorie,
    deleteCategorie
};
