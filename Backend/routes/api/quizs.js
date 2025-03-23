const router = require("express").Router();
const Quiz = require("../../models/Quiz");

// @route POST api/quizs/add
// @desc Add new quiz
// @access Public
router.post("/add", async (req, res) => {
    const { titre, nbQuestions, score } = req.body;

    if (!titre || !nbQuestions || !score) {
        return res.status(400).json({ status: "notok", msg: "Veuillez remplir tous les champs obligatoires." });
    }

    try {
        const existingQuiz = await Quiz.findOne({ titre: titre.trim() });
        if (existingQuiz) {
            return res.status(400).json({ status: "quiz_exists", msg: "Le quiz existe déjà." });
        }

        const newQuiz = new Quiz({
            titre: titre.trim(),
            nbQuestions,
            score
        });

        const savedQuiz = await newQuiz.save();

        res.status(201).json({ status: "ok", msg: "Quiz ajouté avec succès.", quiz: savedQuiz });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", msg: "Erreur interne du serveur." });
    }
});

// @route GET api/quiz/all
// @desc Get all quizzes
// @access Public
router.get("/all", async (req, res) => {
    try {
        const quizs = await Quiz.find();
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
        const quiz = await Quiz.findById(id);
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
