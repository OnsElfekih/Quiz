import React, { useState } from 'react';
import { TextField, Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Question = ({ index, removeQuestion }) => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionType, setQuestionType] = useState('ChoixMultiple'); // Default to "ChoixMultiple"
  const [answers, setAnswers] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]); // Start with 2 answers
  const [correctAnswer, setCorrectAnswer] = useState(''); // For ReponsesCourtes

  // Handle changes in the question text
  const handleQuestionTitleChange = (e) => {
    setQuestionTitle(e.target.value);
  };

  // Handle changes in the question type
  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    setAnswers([]); // Reset answers when the question type changes
    setCorrectAnswer(''); // Reset correct answer for ReponsesCourtes
  };

  // Handle changes in answer text
  const handleAnswerChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index].text = e.target.value;
    setAnswers(newAnswers);
  };

  // Handle changes in correct answer checkbox
  const handleCorrectAnswerChange = (index) => {
    const newAnswers = [...answers];
    newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
    setAnswers(newAnswers);
  };

  // Add a new answer
  const addAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]); // Add an empty answer
  };

  // Remove an answer
  const removeAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  // Handle changes in the correct answer for "ReponsesCourtes"
  const handleCorrectAnswerTextChange = (e) => {
    setCorrectAnswer(e.target.value);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Question Type Selection - Above the Question Title */}
      <FormControl fullWidth sx={{ marginBottom: '15px' }}>
        <InputLabel>Type de question</InputLabel>
        <Select
          value={questionType}
          onChange={handleQuestionTypeChange}
          label="Type de question"
        >
          <MenuItem value="ChoixMultiple">Choix Multiple</MenuItem>
          <MenuItem value="ReponsesCourtes">Réponse Courte</MenuItem>
          <MenuItem value="VraiFaux">Vrai/Faux</MenuItem>
          <MenuItem value="SeuleReponse">Seule Réponse</MenuItem>
          <MenuItem value="Correspondance">Correspondance</MenuItem>
        </Select>
      </FormControl>

      {/* Question Title */}
      <TextField
        label={`Question ${index + 1}`}
        fullWidth
        value={questionTitle}
        onChange={handleQuestionTitleChange}
        variant="outlined"
        required
        sx={{
          borderColor: 'white',
          marginBottom: '15px',
          '& .MuiOutlinedInput-root': {
            borderColor: 'white', // White border
          },
        }}
      />

      {/* Display input fields based on the selected question type */}
      {questionType === 'ChoixMultiple' && (
        <>
          {/* Answer Fields for ChoixMultiple */}
          {answers.map((answer, i) => (
            <Grid container spacing={2} key={i} sx={{ marginBottom: '10px' }}>
              <Grid item xs={10}>
                <TextField
                  label={`Réponse ${i + 1}`}
                  fullWidth
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(i, e)}
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
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answer.isCorrect}
                      onChange={() => handleCorrectAnswerChange(i)}
                      color="primary"
                    />
                  }
                  label="Correct"
                />
              </Grid>

              {/* Button to remove the answer only for "ChoixMultiple" */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeAnswer(i)}
                  sx={{ marginTop: '10px' }}
                  disabled={answers.length <= 2} // Disable if there are only 2 answers
                >
                  Supprimer la réponse
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={addAnswer}
            sx={{
              marginTop: '10px',
              backgroundColor: '#00aaff',
              '&:hover': { backgroundColor: '#0044cc' },
            }}
          >
            Ajouter une réponse
          </Button>
        </>
      )}

      {questionType === 'ReponsesCourtes' && (
        <TextField
          label="Réponse correcte"
          fullWidth
          value={correctAnswer}
          onChange={handleCorrectAnswerTextChange}
          variant="outlined"
          required
          sx={{
            borderColor: 'white',
            marginTop: '15px',
            '& .MuiOutlinedInput-root': {
              borderColor: 'white',
            },
          }}
        />
      )}

      {questionType === 'VraiFaux' && (
        <FormControl fullWidth sx={{ marginTop: '15px' }}>
          <InputLabel>Choisir Vrai ou Faux</InputLabel>
          <Select
            value={correctAnswer}
            onChange={handleCorrectAnswerTextChange}
            label="Choisir Vrai ou Faux"
          >
            <MenuItem value="Vrai">Vrai</MenuItem>
            <MenuItem value="Faux">Faux</MenuItem>
          </Select>
        </FormControl>
      )}

      {questionType === 'SeuleReponse' && (
        <TextField
          label="Réponse correcte"
          fullWidth
          value={correctAnswer}
          onChange={handleCorrectAnswerTextChange}
          variant="outlined"
          required
          sx={{
            borderColor: 'white',
            marginTop: '15px',
            '& .MuiOutlinedInput-root': {
              borderColor: 'white',
            },
          }}
        />
      )}

      {questionType === 'Correspondance' && (
        <>
          <TextField
            label="Réponse correcte"
            fullWidth
            value={correctAnswer}
            onChange={handleCorrectAnswerTextChange}
            variant="outlined"
            required
            sx={{
              borderColor: 'white',
              marginTop: '15px',
              '& .MuiOutlinedInput-root': {
                borderColor: 'white',
              },
            }}
          />
          {/* Add logic for Correspondance type if needed */}
        </>
      )}

      {/* Button to remove the question */}
      <Button
        variant="outlined"
        color="error"
        onClick={() => removeQuestion(index)}
        sx={{
          marginTop: '20px',
        }}
      >
        Supprimer la question
      </Button>
    </Box>
  );
};

export default Question;
