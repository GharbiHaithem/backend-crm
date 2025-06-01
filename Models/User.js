const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto')
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
        default:"represantant",
        enum:["represantant","admin"]
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
     resetPasswordToken: String,
  resetPasswordExpires: Date,
});
// Hachage du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // expire dans 10 minutes
  return resetToken;
};
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;