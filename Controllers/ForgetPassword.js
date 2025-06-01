const User = require("../Models/User");
const crypto = require("crypto");
const sendEmail = require("../Controllers/EmailCtrl"); // fonction nodemailer

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });

  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;

  const message = `
    <p>Bonjour,</p>
    <p>Voici le lien pour réinitialiser votre mot de passe. Ce lien expire dans 10 minutes :</p>
    <a href="${resetURL}">${resetURL}</a>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: message,
    });

    res.status(200).json({ message: "Email envoyé avec succès", token: resetToken });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
  }
};

exports.resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Token invalide ou expiré" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
};
