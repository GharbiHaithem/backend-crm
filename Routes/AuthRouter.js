const { signup, login, lister,editProfile ,getInfoProfil} = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { ensureAuthenticated, authorize } = require('../Middlewares/Auth');

const router = require('express').Router();

// Route pour l'inscription
router.post('/signup', signupValidation, signup);

// Route pour la connexion
router.post('/login', loginValidation, login);

// Route pour lister les utilisateurs, accessible uniquement aux admins
router.get('/list', ensureAuthenticated, authorize(['admin']), lister);
router.get('/Profil', ensureAuthenticated, getInfoProfil);
router.put('/editProfil', ensureAuthenticated, editProfile);
module.exports = router;
