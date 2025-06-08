// models/Ligne.js
const mongoose = require('mongoose');
const ligneSchema = new mongoose.Schema({
     entete: { type: mongoose.Schema.Types.ObjectId, ref: 'Entete', required: true },
     article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article', // Référence au modèle Article
      },
      libelleFamille: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'familles', // Référence au modèle Famille
        required: false
      },
      libelleArticle: {
        type: String,
        required: true
      },
      quantite: {
        type: Number,
        required: true,
        min: 0
      },
      prixHT: {
        type: Number,
        required: true,
        min: 0
      },
      remise: {
        type: Number,
        default: 0,
        min: 0
      },
      tva: {
        type: Number,
        required: true,
        min: 0
      },
      prixTTC: {
        type: Number,
        required: true,
        min: 0
      },
        code: {
    type: String,
    required: false, // facultatif selon ton usage
  },
    }, { timestamps: true });
   

    
    // Exportation du modèle

module.exports = mongoose.model('Ligne', ligneSchema);
