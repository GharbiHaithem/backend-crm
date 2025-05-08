const mongoose = require("mongoose");

const FactureSchema = new mongoose.Schema({
      typeDocument:String,
 
    date:{
      type:Date,
      default:Date.now()
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    referenceCommande:String,
    pointVente:String,
    typePayement:String,
    commentaire:String,
    lignes:Array,
    totalTTC:Number,
    totalHT:Number,
    numFacture:String,
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },

});

const Facture = mongoose.model("Facture", FactureSchema);
module.exports = Facture;
