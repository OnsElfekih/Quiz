const express = require("express");
const router = express.Router();

// Exemple d'une route GET pour récupérer tous les types de questions
router.get("/", async (req, res) => {
  try {
    // Ajoutez ici la logique pour récupérer les types de questions depuis la base de données
    res.status(200).json({ message: "Liste des types de questions" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des types de questions", error });
  }
});

// Exemple d'une route POST pour créer un type de question
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Veuillez fournir un nom pour le type de question" });
  }

  try {
    // Ajoutez ici la logique pour sauvegarder un nouveau type de question dans la base de données
    res.status(201).json({ message: "Type de question créé avec succès", name });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du type de question", error });
  }
});

module.exports = router;
