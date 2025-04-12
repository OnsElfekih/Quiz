import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import { AccessTime, Score, Person, AddCircleOutline } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';


import Question from './Question';

const QuizForm = ({ creator }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const score = questions.reduce((acc, q) => acc + (parseInt(q.score) || 0), 0);
    const time = questions.reduce((acc, q) => acc + (parseInt(q.temps) || 0), 0);
    setTotalScore(score);
    setTotalTime(time);
  }, [questions]);

  const handleAddQuestion = () => {
    setQuestions([...questions, {}]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleSaveQuiz = async () => {
    // Prepare the quiz data
    const quizData = {
      titre: quizTitle,
      creator,  // Id of the creator (logged-in user)
      questions: questions.map((question) => ({
        text: question.text,
        type: question.type,
        reponses: question.reponses,
        score: question.score,
        temps: question.temps,
      })),
    };

    console.log("Données envoyées :", JSON.stringify(quizData, null, 2));

    try {
      const response = await fetch('http://localhost:3003/quizs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();

      if (result.status === 'ok') {
        alert('Quiz enregistré avec succès!');
      } else {
        alert(`Erreur: ${result.msg}`);
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert("Une erreur est survenue lors de l'enregistrement du quiz.");
    }
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Typography variant="h5" color="white" sx={{ marginBottom: '20px' }}>Créer un Quiz</Typography>

      {/* Fixed info boxes */}
      <Box sx={{
        position: 'fixed',
        top: '120px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1000,
      }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <Score color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Score Total</Typography>
            <Typography variant="h6">{totalScore}</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <AccessTime color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Temps Total</Typography>
            <Typography variant="h6">{totalTime} s</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <Person color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Créateur</Typography>
            <Typography variant="h6">{creator}</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <AddCircleOutline color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Ajouter</Typography>
            <Button onClick={handleAddQuestion} variant="contained" size="small" sx={{ mt: 1 }}>+ Question</Button>
          </Box>
        </motion.div>
      </Box>

      {/* Quiz Title Field */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <TextField
            label="Titre du Quiz"
            fullWidth
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            variant="outlined"
            required
            sx={{
              borderColor: 'white',
              '& .MuiOutlinedInput-root': {
                borderColor: 'white',
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Render Questions */}
      {questions.map((_, index) => (
        <Box
          key={index}
          sx={{
            border: '1px solid white',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Question
            index={index}
            removeQuestion={handleRemoveQuestion}
            onChange={handleQuestionChange}
          />
        </Box>
      ))}

      {/* Save Quiz Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999,
        }}
      >
        <Button
          variant="contained"
          onClick={handleSaveQuiz}
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: '#00aaff',
            borderRadius: '8px',
            color: 'white',
            paddingX: '20px',
            paddingY: '10px',
            fontWeight: 'bold',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: '#0044cc',
            },
          }}
        >
          Enregistrer le Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default QuizForm;
