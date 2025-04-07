import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import Question from './Question';

const QuizForm = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [image, setImage] = useState(null);

  // Handler to upload the image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // To display the image preview
    }
  };

  // Add a new question to the quiz
  const handleAddQuestion = () => {
    setQuestions([...questions, {}]);
  };

  // Remove a question from the quiz
  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  // Save the quiz
  const handleSaveQuiz = async () => {
    // Collect quiz data
    const quizData = {
      titre: quizTitle,
      image: image, // If sending the image as a URL or base64 string, you'll need to handle the upload and return the URL.
      questions: questions.map((question, index) => ({
        text: question.text, 
        type: question.type, 
        reponses: question.reponses, 
      })),
    };
  
    // Send data to your backend
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
      alert('Une erreur est survenue lors de l\'enregistrement du quiz.');
    }
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Typography variant="h5" color="white" sx={{ marginBottom: '20px' }}>Créer un Quiz</Typography>

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
                borderColor: 'white', // White border
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Image Upload Field */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: '#00aaff',
              borderRadius: '8px',
              color: 'white',
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#0044cc',
              },
            }}
          >
            Télécharger une image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>

          {/* Image Preview */}
          {image && <img src={image} alt="Quiz" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '20px' }} />}
        </Grid>
      </Grid>

      {/* Question Counter */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <Typography variant="h6" color="white">
            Nombre de Questions : {questions.length}
          </Typography>
        </Grid>
      </Grid>

      {/* Add Question Button */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleAddQuestion}
            sx={{
              backgroundColor: '#00aaff',
              borderRadius: '8px',
              color: 'white',
              '&:hover': {
                backgroundColor: '#0044cc',
              },
            }}
          >
            Ajouter une Question
          </Button>
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
          />
        </Box>
      ))}

      {/* Save Quiz Button at the bottom */}
      <Box sx={{ marginTop: 'auto', textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handleSaveQuiz}
          sx={{
            backgroundColor: '#00aaff',
            borderRadius: '8px',
            color: 'white',
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
