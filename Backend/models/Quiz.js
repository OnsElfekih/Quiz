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
    date: {
        type: Date, 
        default: Date.now, 
        required: true,
    },
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
