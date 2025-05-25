
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const CaisseSchema = new Schema({
    nom_caisse: { type: String,required:true },
    fond_caisse: {  type: Number,required:true  },
    client:{type:mongoose.Schema.Types.ObjectId,ref:'Client'}
});

module.exports = mongoose.model('Caisse', CaisseSchema);
