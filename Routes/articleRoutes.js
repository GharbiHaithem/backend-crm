// Dans le fichier de routes (par exemple, articleRoutes.js)
const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/multerConfig");
const { 
    getArticles, 
    getArticleByID, 
    createArticle, 
    updateArticle, 
    deleteArticle,
    getArticleByCode // Ajoutez cette ligne
} = require("../Controllers/ArticleController");

// Routes pour les articles
router.get("/", getArticles); // Récupérer tous les articles
router.get("/:id", getArticleByID); // Récupérer un article par ID
router.post("/", upload.single("image_article"), createArticle); // Ajouter un nouvel article (avec upload d'image)
router.put("/:id", updateArticle); // Modifier un article par ID
router.delete("/:id", deleteArticle); // Supprimer un article par ID
router.get('/code/:code', getArticleByCode); // Récupérer un article par son code

module.exports = router;