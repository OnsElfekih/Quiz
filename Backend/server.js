const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const bodyParser = require('body-parser');

const users = require("./routes/api/users");
const quizzes = require("./routes/api/quizs");
const questions = require("./routes/api/questions");
const typequestions = require("./routes/api/Typequestions");
const reponses = require("./routes/api/reponses");
const quizRoutes = require('./routes/api/quizroutes');
const quizReponseRoutes = require("./routes/api/quizResponse");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());




// Connexion à MongoDB
const mongo_url = "mongodb://localhost:27017/Projet"; 
mongoose.connect(mongo_url, {  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Définir les routes API
app.use("/users", users);
app.use("/quizs", quizzes);
app.use("/questions", questions);
app.use("/Typequestions", typequestions);
app.use("/reponses", reponses);
app.use("/quizroutes", quizRoutes);
app.use("/quizResponse",quizReponseRoutes);

const port = process.env.PORT || 3003; 
app.listen(port, () => console.log(`Server running on port ${port}`));
