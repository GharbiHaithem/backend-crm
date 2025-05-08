require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration MongoDB Atlas
const DB_USER = '';
const DB_PASSWORD = encodeURIComponent(''); // Encodage du mot de passe
const DB_CLUSTER = 'calendrier.uk8xt.mongodb.net';
const DB_NAME = 'Calendrier';

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

// Connexion à MongoDB avec gestion d'erreurs détaillée
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout après 5 secondes
      socketTimeoutMS: 45000, // Timeout des sockets
    });
    console.log('✅ Connecté à MongoDB Atlas avec succès !');
    
    // Vérification de la connexion
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.command({ ping: 1 });
    console.log('🟢 Ping MongoDB réussi:', pingResult);

    // Affiche les collections disponibles (pour debug)
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections disponibles:', collections.map(c => c.name));

  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    console.log('⚠️ Solution possible:');
    console.log('1. Vérifiez votre connexion Internet');
    console.log('2. Whitelistez votre IP dans MongoDB Atlas:');
    console.log('   - Allez sur https://cloud.mongodb.com');
    console.log('   - Security → Network Access → Add IP Address');
    console.log('3. Vérifiez vos identifiants MongoDB');
    process.exit(1); // Quitte l'application en cas d'échec
  }
};

// Route de test
app.get('/test', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      throw new Error('Pas de connexion à MongoDB');
    }

    // Test d'une opération basique
    const testDoc = { timestamp: new Date(), message: "Ceci est un test" };
    const testCollection = mongoose.connection.db.collection('test_connection');
    await testCollection.insertOne(testDoc);
    
    res.status(200).json({
      status: 'success',
      message: 'Connexion MongoDB opérationnelle',
      dbStats: await mongoose.connection.db.stats()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Échec des opérations MongoDB',
      error: err.message,
      solution: "Whitelistez votre IP dans MongoDB Atlas"
    });
  }
});





// Nouvelle route pour gérer tous les types d'événements
app.post('/api/events', async (req, res) => {
    try {
      // Validation des données
      if (!req.body.type || !req.body.title || !req.body.start || !req.body.end) {
        return res.status(400).json({ message: 'Champs requis manquants' });
      }
  
      const newEvent = new Event(req.body);
      await newEvent.save();
      
      res.status(201).json(newEvent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Route pour récupérer tous les événements
  app.get('/api/events', async (req, res) => {
    try {
      const events = await Event.find().sort({ start: 1 });
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  



// Démarrage du serveur
const startServer = async () => {
  await connectToDatabase();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
    🚀 Serveur démarré sur http://localhost:${PORT}
    ├─ MongoDB: ${DB_CLUSTER}
    ├─ Base de données: ${DB_NAME}
    └─ Test endpoint: http://localhost:${PORT}/test
    `);
  });
};

startServer();

// Gestion propre des arrêts
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('⛔ Connexion MongoDB fermée');
  process.exit(0);
});