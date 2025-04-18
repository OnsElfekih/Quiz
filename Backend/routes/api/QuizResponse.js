
const express = require("express");
const router = express.Router();
const Quiz = require("../../models/quiz");
const QuizResponse = require("../../models/quizResponse");


  console.log("QuizResponse route file loaded");

  // Route pour soumettre les résultats d'un quiz
  router.post('/submitquiz/:userId/:quizId', async (req, res) => {
  console.log("Requête POST reçue à /submitquiz"); 

  const {score} = req.body;
  const {quizId,userId}=req.params;
  console.log('Données reçues :', req.body);
  try {
    console.log('Dojhhgjhy'+quizId);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.log('Quiz non trouvé  ' + quizId);
      return res.status(404).json({ message: 'Quiz not found' });
    }
    console.log('Données reçffues :');

    // Sauvegarder les résultats (score, userId, quizId, date) dans la base de données
    const quizResponse = new QuizResponse({
      userId,
      quizId,
      score,
      completedAt: Date.now(), // Utilise la date fournie, sinon la date actuelle
    });

    await quizResponse.save();

    res.status(200).json({ message: 'Quiz submitted successfully', score });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
  });
  // Route to get completed quizzes for a specific user
  router.get('/completed-quizzes/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      // Fetch the completed quizzes for the user, populating the quiz details
      const completedQuizzes = await QuizResponse.find({ userId })
        .populate('quizId')  // This will populate the quiz details
        .exec();

      if (!completedQuizzes.length) {
        return res.status(404).json({ message: 'No completed quizzes found' });
      }

      res.status(200).json(completedQuizzes);
    } catch (err) {
      console.error('Error fetching completed quizzes:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
