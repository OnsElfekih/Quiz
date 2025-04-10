const express = require("express");
const router = express.Router();
const Quiz = require("../../models/quiz"); 
const Question = require("../../models/Question");

// @route POST api/quizs/create
// @desc Create a new quiz
// @access Public

router.post("/create", async (req, res) => {
    console.log("eee")
    const quizData = req.body; // The data sent from the client
    console.log(quizData);
  
    try {
      const { titre, nbQuestions, score, pic, creator, questions } = req.body;
      
      if (!titre || !nbQuestions || !score || !creator || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Champs requis manquants ou invalides." });
      }
  
      // 1. Créer les questions et récupérer leurs IDs
      const savedQuestions = await Promise.all(
        questions.map(async (q) => {
          const newQuestion = new Question({
            text: q.text,
            type: q.type,
            temps: q.temps,
            score: q.score,
            reponses: q.reponses,
          });
          return await newQuestion.save();
        })
      );
      console.log('Received quiz data:', quizData);
      const questionIds = savedQuestions.map(q => q._id);
  
      // 2. Créer le quiz avec les questions
      const newQuiz = new Quiz({
        titre,
        nbQuestions,
        score,
        pic,
        creator,
        questions: questionIds
      });
  
      const savedQuiz = await newQuiz.save();
  
      res.status(201).json({ message: "Quiz créé avec succès", quiz: savedQuiz });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la création du quiz." });
    }
  });

// @route GET api/quiz/all
// @desc Get all quizzes
// @access Public
router.get("/all", async (req, res) => {
    try {
        const quizs = await Quiz.find().populate("questions");;
        res.status(200).json(quizs);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des quizzes", error });
    }
});

// @route GET api/quiz/:id
// @desc Get quiz by ID
// @access Public
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await Quiz.findById(id).populate("questions"); 
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz non trouvé' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du quiz', error });
    }
});

// @route PUT api/quiz/:id
// @desc Update quiz by ID
// @access Public
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titre, nbQuestions, score } = req.body;
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            { titre, nbQuestions, score },
            { new: true }
        );
        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz non trouvé' });
        }
        res.status(200).json({ message: 'Quiz mis à jour avec succès', updatedQuiz });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du quiz', error });
    }
});

// @route DELETE api/quiz/:id
// @desc Delete quiz by ID
// @access Public
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz non trouvé' });
        }
        res.status(200).json({ message: 'Quiz supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du quiz', error });
    }
});

module.exports = router;
