const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, enum: ["ChoixMultiple", "ReponsesCourtes", "VraiFaux", "SeuleReponse", "Correspondance"], required: true },
    temps: { type: Number, required: true },
    reponses: [{ text: String, valide: Boolean }],
    score : {type: Number, required: true}
});

module.exports = mongoose.model("Question", QuestionSchema);
