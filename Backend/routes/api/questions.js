const express = require("express");
const router = express.Router();
const Question = require("../../models/Question");

// Ajouter une question
router.post("/add", async (req, res) => {
    try {
        const nouvelleQuestion = new Question(req.body);
        await nouvelleQuestion.save();
        res.status(201).json(nouvelleQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir toutes les questions
router.get("/all", async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir une question par ID
router.get("/:id", async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question non trouvée" });
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Supprimer une question
router.delete("/:id", async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: "Question supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
