const mongoose = require("mongoose");

const ModePayementSchema = new mongoose.Schema({
 modeName: {
    type: String,
    enum: ['Espece', 'Cheque', 'Effet'],
    default: 'Espece',
    required:true
  },
    banqueName: { type: String , default:null},
    codeBanque:{ type: Number , default:0},
    numeroCompte:{ type: Number , default:0},
    facture:[{type:mongoose.Schema.Types.ObjectId,ref:'Facture'}],
    dateEcheance:{type:Date,default:null,required:false},
    montant:Number,
    date:{
      type:Date,
      default:Date.now()
    },


},
{
      timestamps:true
});


const ModePayement = mongoose.model("ModePayement", ModePayementSchema);
module.exports = ModePayement;
