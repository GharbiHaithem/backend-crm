const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role :{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    address: {
        type: String,
        required: false,
        default:null
    },
    phone: {
        type: String,
        required: false,
          default:null
    },
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;