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
    
    creator: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', 
        required: true,
    },
    questions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question"
        }
      ],
    creationDate: {
        type: Date,
        default: Date.now, 
    }
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
