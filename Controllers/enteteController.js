const Entete = require("../Models/Entete");
const Ligne = require("../Models/Ligne");
const PDFDocument = require("pdfkit");

// Modifier la méthode create pour générer automatiquement le numéro
exports.create = async (req, res) => {
  const {
    client,
    referenceCommande,
    pointVente,
    typePaiement,
    commentaire,
    totalHT,
    totalTTC,
    lignes,
    typeDocument,
    numero,
    date,
  } = req.body;

  try {
    // Créer l'entête
    const entete = new Entete({
      typeDocument: typeDocument,
      numero: numero,
      date: date,
      client,
      referenceCommande,
      pointVente,
      typePaiement,
      commentaire,
      totalHT,
      totalTTC,
    });

    const savedEntete = await entete.save();
    const savedLignes = await Promise.all(
      lignes.map(async (ligne) => {
        const newLigne = new Ligne({
          entete: savedEntete._id,
          article: ligne.article,
          famille: ligne.famille,
          libelleArticle: ligne.libelleArticle,
          quantite: ligne.quantite,
          prixHT: ligne.prixHT,
          remise: ligne.remise,
          tva: ligne.tva,
          prixTTC: ligne.prixTTC,
        });

        return await newLigne.save();
      })
    );

    savedEntete.lignes = savedLignes.map((ligne) => ligne._id);
    await savedEntete.save();

    res.status(201).json(savedEntete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getTotalByTypeDocument = async (req, res) => {
  console.log(req.params);
  const { typeDocument, year } = req.params;

  try {
    // Compter le nombre de documents avec le typeDocument spécifié et l'année donnée
    const documentCount = await Entete.countDocuments({
      typeDocument,
      date: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    });
    console.log(documentCount);
    res.status(200).json({ typeDocument, year, documentCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Consulter tous les documents par type
exports.getDocuments = async (req, res) => {
  const { type } = req.query;
  try {
    const documents = await Entete.find({ typeDocument: type })
      .populate("client")
      .populate("lignes");

    res.status(200).json(documents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  2. Voir les détails d’un document
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Entete.findById(req.params.id)
      .populate("client")
      .populate("lignes");
    if (!document) {
      return res.status(404).json({ message: "Document non trouvé" });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  3. Éditer un document
exports.updateDocument = async (req, res) => {
  try {
    const updatedDocument = await Entete.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: "Document non trouvé" });
    }
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  4. Supprimer un document
exports.deleteDocument = async (req, res) => {
  try {
    const deletedDocument = await Entete.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: "Document non trouvé" });
    }
    // Supprimer également les lignes associées
    await Ligne.deleteMany({ entete: req.params.id });
    res.status(200).json({ message: "Document supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Télécharger un document en PDF
exports.downloadDocumentPDF = async (req, res) => {
  try {
    const document = await Entete.findById(req.params.id)
      .populate("client")
      .populate("lignes");
    if (!document) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    const doc = new PDFDocument();
    const fileName = `document_${document.numero}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text(`Document: ${document.numero}`, { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Date: ${new Date(document.date).toLocaleDateString()}`);
    doc.text(`Client: ${document.client.raisonSociale}`);
    doc.text(`Total HT: ${document.totalHT.toFixed(2)} €`);
    doc.text(`Total TTC: ${document.totalTTC.toFixed(2)} €`);
    doc.moveDown();

    doc.fontSize(14).text("Détails des lignes:", { underline: true });
    document.lignes.forEach((ligne, index) => {
      doc.moveDown();
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${ligne.libelleArticle} - Qté: ${
            ligne.quantite
          } - Prix HT: ${ligne.prixHT.toFixed(2)} €`
        );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Transformer un devis en bon de commande
exports.transformDevisToBonCommande = async (req, res) => {
  try {
    const devis = await Entete.findById(req.params.id).populate("lignes");
    if (!devis || devis.typeDocument !== "Devis") {
      return res.status(404).json({ message: "Devis non trouvé" });
    }

    const bonCommande = new Entete({
      numero: `BC-${Date.now()}`,
      date: new Date(),
      client: devis.client,
      referenceCommande: devis.referenceCommande,
      pointVente: devis.pointVente,
      typePaiement: devis.typePaiement,
      commentaire: devis.commentaire,
      totalHT: devis.totalHT,
      totalTTC: devis.totalTTC,
    });

    const savedBC = await bonCommande.save();

    const newLignes = await Promise.all(
      devis.lignes.map(async (ligne) => {
        const newLigne = new Ligne({
          entete: savedBC._id,
          article: ligne.article,
          famille: ligne.famille,
          libelleArticle: ligne.libelleArticle,
          quantite: ligne.quantite,
          prixHT: ligne.prixHT,
          remise: ligne.remise,
          tva: ligne.tva,
          prixTTC: ligne.prixTTC,
        });

        return await newLigne.save();
      })
    );

    savedBC.lignes = newLignes.map((ligne) => ligne._id);
    await savedBC.save();

    res.status(200).json(savedBC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Transformer un bon de commande en facture
exports.transformBonCommandeToFacture = async (req, res) => {
  try {
    const bonCommande = await Entete.findById(req.params.id).populate("lignes");
    if (!bonCommande || bonCommande.typeDocument !== "Bon de Commande") {
      return res.status(404).json({ message: "Bon de commande non trouvé" });
    }

    const facture = new Entete({
      typeDocument: "Facture",
      numero: `FACT-${Date.now()}`,
      date: new Date(),
      client: bonCommande.client,
      referenceCommande: bonCommande.referenceCommande,
      pointVente: bonCommande.pointVente,
      typePaiement: bonCommande.typePaiement,
      commentaire: bonCommande.commentaire,
      totalHT: bonCommande.totalHT,
      totalTTC: bonCommande.totalTTC,
    });

    const savedFacture = await facture.save();

    const newLignes = await Promise.all(
      bonCommande.lignes.map(async (ligne) => {
        const newLigne = new Ligne({
          entete: savedFacture._id,
          article: ligne.article,
          famille: ligne.famille,
          libelleArticle: ligne.libelleArticle,
          quantite: ligne.quantite,
          prixHT: ligne.prixHT,
          remise: ligne.remise,
          tva: ligne.tva,
          prixTTC: ligne.prixTTC,
        });

        return await newLigne.save();
      })
    );

    savedFacture.lignes = newLignes.map((ligne) => ligne._id);
    await savedFacture.save();

    res.status(200).json(savedFacture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
