const express = require("express");
const router = express.Router();
const Quiz = require("../../models/quiz");
const Question = require("../../models/Question");

// Ajouter une fonction pour valider les questions
function validateQuestions(questions) {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`Vérification de la question ${i + 1}:`, question);
  
      if (!question.text || !question.type || !question.reponses || !Array.isArray(question.reponses) || question.reponses.length < 1) {
        console.log("Erreur dans les données de la question", question);
        return false;
      }
  
      // Vérification des réponses
      for (let j = 0; j < question.reponses.length; j++) {
        const reponse = question.reponses[j];
        if (typeof reponse.isCorrect !== 'boolean') {
          console.log("Réponse incorrecte (isCorrect non défini ou non boolean)", reponse);
          return false;
        }
      }
  
      // Validation spécifique par type
      switch (question.type) {
        case "ChoixMultiple":
        case "Correspondance":
          if (question.reponses.length < 2) {
            console.log(`Le type ${question.type} nécessite au moins 2 réponses.`);
            return false;
          }
          break;
  
        case "SeuleReponse":
          if (question.reponses.length !== 1) {
            console.log("Le type SeuleReponse nécessite exactement 1 réponse.");
            return false;
          }
          break;
  
        case "VraiFaux":
          const hasVrai = question.reponses.some(r => r.text === "Vrai");
          const hasFaux = question.reponses.some(r => r.text === "Faux");
          if (question.reponses.length !== 2 || !hasVrai || !hasFaux) {
            console.log("Le type VraiFaux nécessite exactement les réponses 'Vrai' et 'Faux'.");
            return false;
          }
          break;
  
        case "ReponsesCourtes":
          if (!question.reponses[0].text || question.reponses.length !== 1) {
            console.log("Le type ReponsesCourtes nécessite exactement 1 réponse texte.");
            return false;
          }
          break;
  
        default:
          console.log("Type de question non reconnu :", question.type);
          return false;
      }
    }
  
    return true;
  }
  
  

// @route POST api/quizs/create
// @desc Créer un nouveau quiz
// @access Public
router.post("/create", async (req, res) => {
    

    try {
        console.log("Données envoyées create!! :", req.body);
        const { titre, nbQuestions, creator, time, score, questions } = req.body;

        // Validation des champs obligatoires
        if (!titre || !nbQuestions || !creator || !Array.isArray(questions)) {
            console.log("Validation échouée :");
            console.log("titre:", titre);
            console.log("nbQuestions:", nbQuestions);
            console.log("creator:", creator);
            console.log("questions est un tableau ?", Array.isArray(questions));
            return res.status(400).json({ message: "Champs requis manquants ou invalides." });
        }

        // Validation des questions
         if (!validateQuestions(questions)) {
            return res.status(400).json({ message: "Les questions contiennent des erreurs." });
        } 

        const newQuiz = new Quiz({
            titre,
            nbQuestions,
            time,
            score,
            creator,
            questions
        });

        const savedQuiz = await newQuiz.save();

        res.status(201).json({ message: "Quiz créé avec succès", quiz: savedQuiz });
        console.log("Quiz créé avec succès !!");

    } catch (error) {
        console.error("Erreur complète :", error);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.titre) {
            return res.status(400).json({ message: "Ce titre de quiz existe déjà. Choisissez un autre." });
          }
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});



// @route GET api/quiz/all
// @desc Récupérer tous les quizzes
// @access Public
router.get("/all", async (req, res) => {
    try {
        const quizs = await Quiz.find().populate("questions");
        res.status(200).json(quizs);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des quizzes", error });
    }
});

// @route GET api/quiz/:id
// @desc Récupérer un quiz par ID
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
// @desc Mettre à jour un quiz par ID avec recalcul dynamique du score
// @access Public
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titre, nbQuestions, pic, creator, questions } = req.body;

    try {
        // 1. Vérifier que le quiz existe
        const existingQuiz = await Quiz.findById(id);
        if (!existingQuiz) {
            return res.status(404).json({ message: 'Quiz non trouvé' });
        }

        let questionIds = existingQuiz.questions; // Valeur par défaut si pas de nouvelles questions
        let totalScore = existingQuiz.score;

        // 2. Si on reçoit de nouvelles questions → les remplacer et recalculer le score
        if (Array.isArray(questions)) {
            // Supprimer les anciennes questions associées au quiz
            await Question.deleteMany({ _id: { $in: existingQuiz.questions } });

            // Créer et sauvegarder les nouvelles questions
            const savedQuestions = await Promise.all(
                questions.map(async (q) => {
                    const newQuestion = new Question({
                        text: q.text,
                        type: q.type,
                        temps: q.temps,
                        score: q.score,
                        reponses: q.reponses,
                    });
                    const saved = await newQuestion.save();
                    return saved;
                })
            );

            questionIds = savedQuestions.map(q => q._id);
            totalScore = savedQuestions.reduce((sum, q) => sum + q.score, 0);
        }

        // 3. Mettre à jour le quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            {
                titre,
                nbQuestions,
                pic,
                creator,
                score: totalScore,
                questions: questionIds
            },
            { new: true }
        );

        res.status(200).json({ message: 'Quiz mis à jour avec succès', updatedQuiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du quiz', error });
    }
});

// @route DELETE api/quiz/:id
// @desc Supprimer un quiz par ID
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
