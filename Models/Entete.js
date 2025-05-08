
const mongoose = require('mongoose');

const enteteSchema = new mongoose.Schema({
    typeDocument: { type: String, required: false },
    numero: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    referenceCommande: { type: String, required: false },
    pointVente:{ type: String },
    typePaiement: { type: String },
    commentaire: { type: String },
    totalHT: { type: Number, required: true },
    totalTTC: { type: Number, required: true },
    lignes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ligne' }]  
}, { timestamps: true });

module.exports = mongoose.model('Entete', enteteSchema);