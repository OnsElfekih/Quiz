const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        trim: true, 
        unique: true, 
    },
    nbQuestions: {
        type: Number,
        required: true,
        min: 1, 
    },
    score: {
        type: Number,
        required: true,
        min: 0, 
    },
    time: {
        type: Number,
        required: true,
        min: 0, 
    },
    
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    questions: [
        {
          text: { type: String, required: true },
          type: { type: String, enum: ["ChoixMultiple", "ReponsesCourtes", "VraiFaux", "SeuleReponse", "Correspondance"], required: true },
          temps: { type: Number, required: true },
          reponses: [{ text: String, isCorrect: Boolean }],
          score: { type: Number, required: true }
        }
    ],
    creationDate: {
        type: Date,
        default: Date.now, 
    }
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
