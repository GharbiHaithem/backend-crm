const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

// Inscription de l'utilisateur
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Vérification si l'utilisateur existe déjà
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "L'utilisateur existe déjà", success: false });
    }

    // Création de l'utilisateur avec un mot de passe haché
    const userModel = new UserModel({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'user' // Si aucun rôle n'est spécifié, on assigne 'user' par défaut
    });

    await userModel.save();
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur interne",
      success: false,
    });
  }
};

// Connexion de l'utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérification si l'utilisateur existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "Échec de l'authentification, email ou mot de passe incorrect", success: false });
    }

    // Vérification du mot de passe
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: "Échec de l'authentification, email ou mot de passe incorrect", success: false });
    }

    // Création du token JWT
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      success: true,
      jwtToken,
      email,
      name: user.name,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur interne",
      success: false,
    });
  }
};

// Liste des utilisateurs (protégée)
const lister = async (req, res) => {
  try {
    // Vérifier que l'utilisateur a le rôle d'admin avant de lister les utilisateurs
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur : ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  login,
  lister,
};
