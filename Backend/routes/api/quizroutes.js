const express = require('express');
const multer = require('multer');
const Quiz = require('../../models/quiz');
const Question = require('../../models/Question');

const router = express.Router();

// Storage setup for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limit size to 5 MB
});

// Create a new quiz
router.post('/api/quiz', upload.single('pic'), async (req, res) => {
  try {
    const { titre, nbQuestions, score, creator } = req.body;
    const pic = req.file ? req.file.buffer : null;

    const newQuiz = new Quiz({
      titre,
      nbQuestions,
      score,
      creator,
      pic
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating quiz' });
  }
});

// Get a quiz by ID
router.get('/api/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('creator', 'name email');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving quiz' });
  }
});

// Add a question to a quiz
router.post('/api/quiz/:quizId/questions', async (req, res) => {
  try {
    const { text, type, temps, reponses } = req.body;
    const { quizId } = req.params;

    const newQuestion = new Question({
      text,
      type,
      temps,
      reponses,
      quizId // Reference to quiz
    });

    // Add the question to the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await newQuestion.save();

    // Update quiz with the number of questions
    quiz.nbQuestions += 1;
    await quiz.save();

    res.status(201).json({ newQuestion, updatedQuiz: quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding question' });
  }
});

// Get questions for a quiz
router.get('/api/quiz/:quizId/questions', async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving questions' });
  }
});

module.exports = router;
