const Article = require("../Models/Article");
const Famille = require("../Models/Famille");
const Categorie = require("../Models/Categorie");
const mongoose = require("mongoose");
const upload = require("../Middlewares/multerConfig");

// Get all articles
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("libelleFamille")
      .populate("libeleCategorie");
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new article
const createArticle = async (req, res) => {
  const {
    code,
    libelle,
    libelleFamille,
    Nombre_unite,
    tva,
    type,
    prix_brut,
    remise,
    prix_net,
    marge,
    prixht,
    prix_totale_concré,
    gestion_configuration,
    configuration,
    serie,
    libeleCategorie,
    lib_fournisseur,
    Nature,
    prixmin,
    prixmax,
    user_Connectée,
    action_user_connecté,
    date_modif,
    time_modif,
    prix_achat_initiale,
    tva_achat,
    dimension_article,
    longueur,
    largeur,
    hauteur,
    movement_article,
  } = req.body;

  try {
    // Vérifier si les références existent
    const familleArticle = await Famille.findById(libelleFamille);
    const categorieArticle = await Categorie.findById(libeleCategorie);

    if (!familleArticle || !categorieArticle) {
      return res
        .status(404)
        .json({ message: "Référence non trouvée (Famille ou Catégorie)" });
    }

    // Récupérer l'image depuis req.file (géré par multer)
    const image_article = req.file ? req.file.buffer : null;

    // Convertir les booléens en nombres
    const parsedSerie = serie === "true" || serie === true ? 1 : 0;
    const parsedDimension =
      dimension_article === "true" || dimension_article === true ? 1 : 0;

    // Créer un nouvel article
    const newArticle = await Article.create({
      code,
      libelle,
      libelleFamille,
      Nombre_unite,
      tva,
      type,
      prix_brut,
      remise,
      prix_net,
      marge,
      prixht,
      prix_totale_concré,
      gestion_configuration,
      configuration,
      serie: parsedSerie,
      libeleCategorie,
      lib_fournisseur,
      Nature,
      image_article,
      prixmin,
      prixmax,
      user_Connectée,
      action_user_connecté,
      date_modif,
      time_modif,
      prix_achat_initiale,
      tva_achat,
      dimension_article: parsedDimension,
      longueur,
      largeur,
      hauteur,
      movement_article,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Erreur lors de la création du Article :", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la création du Article.",
        error: error.message,
      });
  }
};

// Get article by ID
const getArticleByID = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("libelleFamille")
      .populate("libeleCategorie");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update article
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const {
    libelle,
    libelleFamille,
    Nombre_unite,
    tva,
    type,
    prix_brut,
    remise,
    prix_net,
    marge,
    prixht,
    prix_totale_concré,
    gestion_configuration,
    configuration,
    serie,
    libeleCategorie,
    lib_fournisseur,
    Nature,
    prixmin,
    prixmax,
    user_Connectée,
    action_user_connecté,
    date_modif,
    time_modif,
    prix_achat_initiale,
    tva_achat,
    dimension_article,
    longueur,
    largeur,
    hauteur,
    movement_article,
  } = req.body;
console.log(libelleFamille)
console.log(libeleCategorie)
console.log(req.body)
  try {
    // const familleArticle = await Famille.findById(libelleFamille);
    // const categorieArticle = await Categorie.findById(libeleCategorie);

    // if (!familleArticle || !categorieArticle) {
    //   return res
    //     .status(404)
    //     .json({ message: "Famille ou Categorie non trouvée" });
    // }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        libelle,
        libelleFamille,
        Nombre_unite,
        tva,
        type,
        prix_brut,
        remise,
        prix_net,
        marge,
        prixht,
        prix_totale_concré,
        gestion_configuration,
        configuration,
        serie,
        libeleCategorie,
        lib_fournisseur,
        Nature,
        prixmin,
        prixmax,
        user_Connectée,
        action_user_connecté,
        date_modif,
        time_modif,
        prix_achat_initiale,
        tva_achat,
        dimension_article,
        longueur,
        largeur,
        hauteur,
        movement_article,
      },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un article par son code
const getArticleByCode = async (req, res) => {
  try {
    const article = await Article.findOne({ code: req.params.code });
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
// Delete article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`Pas de Article avec l'ID: ${id}`);
    }

    const result = await Article.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send(`Article non trouvé pour l'ID: ${id}`);
    }

    res.json({ message: "Article supprimé avec succès." });
  } catch (error) {
    console.error("Error deleting Article:", error);
    res.status(500).json({ message: "Erreur du serveur.", error });
  }
};

module.exports = {
  getArticles,
  getArticleByID,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleByCode,
};
