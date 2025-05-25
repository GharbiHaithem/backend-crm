const express = require("express"); 
const mongoose = require("mongoose");
const router = express.Router();
const Event = require("../Models/Event");  // Assurez-vous que le modèle est correct

// Récupérer tous les événements avec les informations du client et participant
router.get("/", async (req, res) => {
    try {
        const events = await Event.find(); // On récupère tous les événements
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des événements." });
    }
});

// Récupérer un événement spécifique par ID avec les informations du client et du participant
router.get("/:id/show", async (req, res) => {
    const { id } = req.params;

    // Vérification si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID invalide" });
    }

    try {
        const event = await Event.findById(id);  // On ne fait pas de population, puisque client et participant sont des simples chaînes
        if (!event) {
            return res.status(404).json({ error: "Événement non trouvé" });
        }
        res.status(200).json(event); // Renvoie l'événement avec les informations du client et participant
    } catch (err) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'événement." });
    }
});

// Ajouter un nouvel événement
// Ajouter un nouvel événement
router.post("/", async (req, res) => {
    const { title, start, end, describe, client, participant } = req.body;

    // Vérification des champs obligatoires
    if (!title || !start || !end || !client || !participant) {
        return res.status(400).json({ error: "Tous les champs sont requis, y compris l'ID du client et du participant." });
    }

    // Vérification de la validité des dates
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Vérifier si les dates sont valides
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Les dates de début et de fin doivent être valides." });
    }

    // Vérifier que la date de fin est après la date de début
    if (startDate >= endDate) {
        return res.status(400).json({ error: "La date de fin doit être après la date de début." });
    }

    // Vérification de la durée de l'événement : doit être au moins 1 heure
    const duration = (endDate - startDate) / (1000 * 60 * 60);  // Conversion en heures
    if (duration < 1) {
        return res.status(400).json({ error: "La durée de l'événement doit être d'au moins une heure." });
    }

    try {
        const newEvent = new Event({
            title,
            start: startDate,   // Stocker les dates sous forme d'objets Date
            end: endDate,
            describe,
            client,  // Lier l'événement au client via l'ID
            participant  // Lier l'événement au participant
        });

        // Sauvegarder l'événement dans la base de données
        await newEvent.save();
        
        // Retourner l'événement créé avec un statut 201 (Créé)
        res.status(201).json(newEvent); 
    } catch (err) {
        // Afficher l'erreur pour faciliter le débogage
        console.error("Erreur lors de l'ajout de l'événement :", err);
        
        // Retourner un message d'erreur générique pour l'utilisateur
        res.status(500).json({ error: "Une erreur est survenue lors de l'ajout de l'événement." });
    }
});

// Mettre à jour un événement par ID
router.put("/:id/update", async (req, res) => {
    const { id } = req.params;

    // Vérification si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID invalide" });
    }

    const { title, start, end, describe, client, participant } = req.body;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Événement non trouvé" });
        }

        // Si le client ou participant est changé, on met à jour
        event.title = title || event.title;
        event.start = start || event.start;
        event.end = end || event.end;
        event.describe = describe || event.describe;
        event.client = client || event.client;
        event.participant = participant || event.participant;

        await event.save();
        res.status(200).json(event); // Renvoie l'événement mis à jour
    } catch (err) {
        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de l'événement." });
    }
});

// Supprimer un événement par ID
router.delete("/:id/delete", async (req, res) => {
    const { id } = req.params;

    // Vérification si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID invalide" });
    }

    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ error: "Événement non trouvé" });
        }
        res.status(200).json({ message: "Événement supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de l'événement." });
    }
});


module.exports = router;
