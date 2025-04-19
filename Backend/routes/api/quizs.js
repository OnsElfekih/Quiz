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

// @route PUT api/quiz/edit/:id
// @desc Mettre à jour un quiz par ID avec recalcul dynamique du score
// @access Public
router.put('/edit/:id', async (req, res) => {
  try {
      console.log("Données reçues pour modification:", req.body);
      const { id } = req.params;
      const { titre, nbQuestions, creator, time, score, questions } = req.body;

      // Validation (same as create)
      if (!titre || !nbQuestions || !creator || !time || !Array.isArray(questions)) {
          return res.status(400).json({ message: "Champs requis manquants ou invalides." });
      }

      // Find and update quiz
      const updatedQuiz = await Quiz.findByIdAndUpdate(
          id,
          {
              titre,
              nbQuestions,
              time,
              score,
              creator,
              questions
          },
          { new: true, runValidators: true }
      );

      if (!updatedQuiz) {
          return res.status(404).json({ message: 'Quiz non trouvé' });
      }

      res.status(200).json({ 
          message: "Quiz mis à jour avec succès", 
          quiz: updatedQuiz 
      });

  } catch (error) {
      console.error("Erreur:", error);
      if (error.code === 11000 && error.keyPattern?.titre) {
          return res.status(400).json({ 
              message: "Ce titre de quiz existe déjà. Choisissez un autre." 
          });
      }
      res.status(500).json({ 
          message: "Erreur serveur", 
          error: error.message 
      });
  }
});


router.get('/quizs/createdBy/:id', async (req, res) => {
  try {
    const iduser = req.params.id;

    const quizzes = await Quiz.find({ creator: iduser }) // Filtrer dans la requête directement
      .populate('creator', 'username') // Récupérer juste le nom d'utilisateur
      .exec();

    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des quiz' });
  }
});





module.exports = router;
