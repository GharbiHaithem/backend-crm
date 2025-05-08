const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const ClientSchema = new Schema({
    nom_prenom: { type: String,required:true },
    telephone: {  type: String,required:true  },
    code: { type: String ,required:true },
    raison_social: { type: String ,required:true },
    matricule_fiscale: { type: String },
    adresse: { type: String },
    register_commerce: { type: String },
    solde_initial: { type: Number, default: 0 },
    montant_raprochement: { type: Number, default: 0 },
    code_rapprochement: { type: String },
    rapeBl: { type: String },
    solde_initiale_bl: { type: Number, default: 0 },
    montant_reglement_bl: { type: Number, default: 0 },
    taux_retenu: { type: Number, default: 0 }
});

module.exports = mongoose.model('Client', ClientSchema);
