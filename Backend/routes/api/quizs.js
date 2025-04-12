const express = require("express");
const router = express.Router();
const Quiz = require("../../models/quiz");
const Question = require("../../models/Question");

// Ajouter une fonction pour valider les questions
const validateQuestions = (questions) => {
    return questions.every(q => 
        q.text && typeof q.text === 'string' &&
        q.type && ['multiple', 'true-false'].includes(q.type) &&
        q.score && typeof q.score === 'number' && q.score > 0 &&
        Array.isArray(q.reponses) && q.reponses.length > 0
    );
};

// @route POST api/quizs/create
// @desc Créer un nouveau quiz
// @access Public
router.post("/create", async (req, res) => {
    const quizData = req.body;
    console.log(quizData);

    try {
        const { titre, nbQuestions, pic, creator, questions } = req.body;

        // Validation des champs obligatoires
        if (!titre || !nbQuestions || !creator || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Champs requis manquants ou invalides." });
        }

        // Validation des questions
        if (!validateQuestions(questions)) {
            return res.status(400).json({ message: "Les questions contiennent des erreurs." });
        }

        // 1. Créer les questions et récupérer leurs IDs + total du score
        let totalScore = 0;
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
                totalScore += saved.score;
                return saved;
            })
        );

        const questionIds = savedQuestions.map(q => q._id);

        // 2. Créer le quiz avec le score total
        const newQuiz = new Quiz({
            titre,
            nbQuestions,
            score: totalScore, // Calculé automatiquement ici
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
