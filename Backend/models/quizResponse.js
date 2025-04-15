const mongoose = require('mongoose');

const QuizResponseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
    },
  quizId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
    },
 
  score: { 
    type: Number, 
    required: true 
    },
  completedAt: { 
    type: Date, 
    default: Date.now 
    }
});

const QuizResponse = mongoose.model('QuizResponse', QuizResponseSchema);
module.exports = QuizResponse;

