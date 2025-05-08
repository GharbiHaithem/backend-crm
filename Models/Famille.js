const mongoose = require("mongoose");

const FamilleSchema = new mongoose.Schema({
    designationFamille: { type: String, required: true },
    codeFamille: { type: String, required: true },
   // categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie", required: true } // Relation avec Categorie
});


const Famille = mongoose.model("Famille", FamilleSchema);
module.exports = Famille;
