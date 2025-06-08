const Article = require("../Models/Article");
const Famille = require("../Models/Famille");
const Categorie = require("../Models/Categorie");
const mongoose = require("mongoose");
const upload = require("../Middlewares/multerConfig");
const Factute = require('../Models/Facture')
const Entete = require('../Models/Entete');
const Facture = require("../Models/Facture");
const Ligne = require('../Models/Ligne')
// Get all articles
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find()
     
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
    // Vérifier si la catégorie existe
    const categorieArticle = await Categorie.findById(libeleCategorie);
    if (!categorieArticle) {
      return res.status(404).json({ message: "Référence non trouvée" });
    }

    // 🔐 Vérifier si un article avec ce code existe déjà
    const existingArticle = await Article.findOne({ code });
    if (existingArticle) {
      return res.status(400).json({ message: `Le code ${code} existe déjà.` });
    }

    // Récupérer l'image depuis req.file (géré par multer)
    const image_article = req.file ? req.file.buffer : null;

    // Convertir les booléens en nombres
    const parsedSerie = serie === "true" || serie === true ? 1 : 0;
    const parsedDimension = dimension_article === "true" || dimension_article === true ? 1 : 0;

    // Créer un nouvel article
    const newArticle = await Article.create({
      code,
      libelle,
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
    res.status(500).json({
      message: "Erreur lors de la création du Article.",
      error: error.message,
    });
  }
};

// Get article by ID
const getArticleByID = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
 
      .populate("libeleCategorie");
console.log({article})
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

    const { id } = req.params;

    try {
    // Étape 1: Récupérer l'article par son ID
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article introuvable." });
    }

    const articleCode = article.code;

    // Étape 2: Vérifier s'il est utilisé dans une facture non totalement payée
    const factureAssociee = await Facture.findOne({
      resteAPayer: { $gt: 0 },
      lignes: { $elemMatch: { code: articleCode } }
    });

    if (factureAssociee) {
      return res.status(400).json({
        message: `Impossible de supprimer l'article car il est utilisé dans une facture non payée .`,
      });
    }

    // Étape 3: Supprimer l'article
    await Article.findByIdAndDelete(id);

    res.status(200).json({ message: "Article supprimé avec succès." });

  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};



const getArticlesBySearch = async (req, res) => {
  try {
    let { code, libelle } = req.query;

    // Filtrer les valeurs nulles ou "null" explicites
    code = code === 'null' || code === null || code === undefined ? null : code;
    libelle = libelle === 'null' || libelle === null || libelle === undefined ? null : libelle;

    const filter = {};
    if (code) filter.code = { $regex: new RegExp(code, "i") };
    if (libelle) filter.libelle = { $regex: new RegExp(libelle, "i") };

    const articles = await Article.find(filter);
    res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur lors du filtrage des articles :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
getArticlesParQuantite = async (req, res) => {
  try {
    const articles = await Article.find({})
      .sort({ Nombre_unite: -1 }).populate('libeleCategorie')

    res.json(articles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  getArticles,
  getArticleByID,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleByCode,
  getArticlesBySearch,
  getArticlesParQuantite
};
