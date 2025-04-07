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

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(bodyParser.json());


app.use(cors({
  origin: "http://localhost:3000",  
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// Connexion à MongoDB
const mongo_url = "mongodb://localhost:27017/Projet"; 
mongoose.connect(mongo_url, {  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Définir les routes API
app.use("/users", users);
app.use("/quizzes", quizzes);
app.use("/questions", questions);
app.use("/Typequestions", typequestions);
app.use("/reponses", reponses);
app.use("/quizroutes", quizRoutes);

const port = process.env.PORT || 3003; 
app.listen(port, () => console.log(`Server running on port ${port}`));
