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
const editProfile = async (req, res) => {
    const { name, phone, password, currentPassword, email ,address} = req.body;
    try {
        const { _id } = req.user;

        // 1. Trouver l'utilisateur actuel
        const user = await UserModel.findOne({_id});
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Utilisateur non trouvé" 
            });
        }

        // 2. Vérification du mot de passe actuel si fourni
        if (currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Mot de passe actuel incorrect" 
                });
            }
        }

        // 3. Préparation des données à mettre à jour
        const updateData = {
            name: name || user.name,
            phone: phone || user.phone,
            email: email || user.email,
            address : address || user.address
        };

        // 4. Si nouveau mot de passe fourni, le hacher
        if (password) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Le mot de passe actuel est requis pour changer le mot de passe"
                });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // 5. Mise à jour de l'utilisateur
        const updatedUser = await UserModel.findByIdAndUpdate(
            _id,
            updateData, // Utiliser updateData au lieu de req.body
            { new: true }
        ).select('-password'); // Exclure le mot de passe de la réponse

        res.status(200).json({
            success: true,
            message: "Profil mis à jour avec succès",
            user: updatedUser
        });

    } catch (error) {
        console.error("Erreur : ", error);
        res.status(500).json({ 
            success: false, 
            message: "Erreur serveur lors de la mise à jour du profil" 
        });
    }
};
const getInfoProfil = async(req,res)=>{
  try {
    const {_id} = req.user
    console.log(req.user)
    const infoUser= await UserModel.findOne({_id}).select('-password')
      res.status(200).json(infoUser);
  } catch (error) {
      console.error("Erreur : ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}
module.exports = {
  signup,
  login,
  lister,
  editProfile,
  getInfoProfil
};
