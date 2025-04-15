
const express = require("express");
const router = express.Router();
const Quiz = require("../../models/quiz");
const QuizResponse = require("../../models/quizResponse");


console.log("QuizResponse route file loaded");

// Route pour soumettre les résultats d'un quiz
router.post('/submitquiz', async (req, res) => {
  console.log("Requête POST reçue à /submitquiz"); 

  const { userId, quizId, score} = req.body; // Extraction de userId, quizId, score et date
  console.log('Données reçues :', req.body);
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Sauvegarder les résultats (score, userId, quizId, date) dans la base de données
    const quizResponse = new QuizResponse({
      userId,
      quizId,
      score,
      completedAt: date || Date.now(), // Utilise la date fournie, sinon la date actuelle
    });

    await quizResponse.save();

    res.status(200).json({ message: 'Quiz submitted successfully', score });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
