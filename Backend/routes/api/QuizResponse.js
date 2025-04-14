const express = require('express');
const router = express.Router();
const QuizResponse = require('../models/QuizResponse');
const Quiz = require('../models/Quiz'); // Le modèle Quiz

// Route pour soumettre les résultats d'un quiz
router.post('/submit-quiz', async (req, res) => {
  const { userId, quizId, score, date } = req.body; // Extraction de userId, quizId, score et date

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
