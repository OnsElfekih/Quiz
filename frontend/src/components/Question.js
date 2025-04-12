import React, { useState, useEffect } from 'react';
import {
  TextField, Box, Button, Checkbox, FormControlLabel,
  Grid, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const Question = ({ index, removeQuestion, onChange }) => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionType, setQuestionType] = useState('ChoixMultiple');
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [temps, setTemps] = useState(10); // Temps par défaut : 10 secondes
  const [score, setScore] = useState(10);  // Score par défaut

  // Mettre à jour le parent via onChange chaque fois qu'une modification se produit
  useEffect(() => {
    // Appeler la fonction onChange du parent pour transmettre les valeurs
    onChange(index, {
      text: questionTitle,
      type: questionType,
      reponses: answers,
      score,
      temps,
    });
  }, [questionTitle, questionType, answers, score, temps]);

  const handleQuestionTitleChange = (e) => {
    setQuestionTitle(e.target.value);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    setAnswers([]);  // Reset les réponses à chaque changement de type de question
    setCorrectAnswer('');
  };

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index].text = e.target.value;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (index) => {
    const newAnswers = [...answers];
    newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
    setAnswers(newAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const removeAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleScoreChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) setScore(value);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Row: Type de question + Score */}
      <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
        <Grid item xs={8}>
          <FormControl fullWidth>
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
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Score"
            type="number"
            fullWidth
            value={score}
            onChange={handleScoreChange}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Durée (s)"
            type="number"
            fullWidth
            value={temps}
            onChange={(e) => setTemps(parseInt(e.target.value))}
          />
        </Grid>
      </Grid>

      {/* Question Title */}
      <TextField
        label={`Question ${index + 1}`}
        fullWidth
        value={questionTitle}
        onChange={handleQuestionTitleChange}
        variant="outlined"
        required
        sx={{ marginBottom: '15px' }}
      />

      {/* Render answers by type */}
      {questionType === 'ChoixMultiple' && (
        <>
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
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeAnswer(i)}
                  sx={{ marginTop: '10px' }}
                  disabled={answers.length <= 2}
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
            sx={{ marginTop: '10px' }}
          >
            Ajouter une réponse
          </Button>
        </>
      )}

      {/* Other types */}
      {['ReponsesCourtes', 'SeuleReponse', 'Correspondance'].includes(questionType) && (
        <TextField
          label="Réponse correcte"
          fullWidth
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          variant="outlined"
          required
          sx={{ marginTop: '15px' }}
        />
      )}

      {questionType === 'VraiFaux' && (
        <FormControl fullWidth sx={{ marginTop: '15px' }}>
          <InputLabel>Choisir Vrai ou Faux</InputLabel>
          <Select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            label="Choisir Vrai ou Faux"
          >
            <MenuItem value="Vrai">Vrai</MenuItem>
            <MenuItem value="Faux">Faux</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Remove question */}
      <Button
        variant="outlined"
        color="error"
        onClick={() => removeQuestion(index)}
        sx={{ marginTop: '20px' }}
      >
        Supprimer la question
      </Button>
    </Box>
  );
};

export default Question;
