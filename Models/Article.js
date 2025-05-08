const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition du schéma Article
const ArticleSchema = new Schema({
    code: {
        type: String, // Changez le type en String
        unique: true
    },
    libelle: {
        type: String,
        required: true,
    },
    libelleFamille: {
        type: Schema.Types.ObjectId,
        ref: 'Famille',  // Correction du nom de référence
       // required: true,
    },
    libeleCategorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',  // Correction du nom de référence
       // required: true, 
    },
    Nombre_unite: {
        type: Number,
    },
    tva: {
        type: Number,
    },
    type: {
        type: String,
    },
    prix_brut: {
        type: Number,
    },
    remise: {
        type: Number,
    },
    prix_net: {
        type: Number,
    },
    marge: {
        type: String,
    },
    prixht: {
        type: Number,
    },
    prix_totale_concré: {
        type: Number,
    },
    gestion_configuration: {
        type: String,
    },
    configuration: {
        type: String,
    },
    serie: {
        type: Boolean,  // Utilisation de boolean pour série
    },

    Nature: {
        type: String,
    },
    image_article: {
        type: Buffer,
    },
    prixmin: {
        type: Number,
    },
    prixmax: {
        type: Number,
    },
    user_Connectée: {
        type: String,
    },
    action_user_connecté: {
        type: String,
    },
    date_modif: {
        type: Date,
    },
    prix_achat_initiale: {
        type: Number,
    },
    tva_achat: {
        type: Number,
    },
    dimension_article: {
        type: Boolean,  // Utilisation de boolean pour dimension_article
    },
    longueur: {
        type: Number,
    },
    largeur: {
        type: Number,
    },
    hauteur: {
        type: Number,
    },
    movement_article: {
        type: String,
    },
});
ArticleSchema.pre("save", async function (next) {
    if (!this.code) { // Vérifiez si `this.code` est défini
        const lastArticle = await mongoose.model("Article").findOne().sort({ code: -1 });
        let lastNumber = 0;

        if (lastArticle && lastArticle.code) {
            // Extrait le numéro du dernier code (par exemple, "ART-0001" -> 1)
            const lastCodeParts = lastArticle.code.split("-");
            if (lastCodeParts.length > 1) {
                lastNumber = parseInt(lastCodeParts[1]);
            }
        }

        // Génère un nouveau code (par exemple, "ART-0002")
        this.code = `ART-${String(lastNumber + 1).padStart(4, "0")}`;
    }
    next();
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
