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
  const [temps, setTemps] = useState(10);
  const [score, setScore] = useState(10);

  // Mettre à jour les réponses pour VraiFaux ou les types texte
  useEffect(() => {
    if (questionType === 'VraiFaux') {
      const updatedAnswers = [
        { text: 'Vrai', isCorrect: correctAnswer === 'Vrai' },
        { text: 'Faux', isCorrect: correctAnswer === 'Faux' }
      ];
      if (JSON.stringify(answers) !== JSON.stringify(updatedAnswers)) {
        setAnswers(updatedAnswers);
      }
    }

    if (['ReponsesCourtes', 'SeuleReponse', 'Correspondance'].includes(questionType)) {
      const updatedAnswers = [{ text: correctAnswer, isCorrect: true }];
      if (JSON.stringify(answers) !== JSON.stringify(updatedAnswers)) {
        setAnswers(updatedAnswers);
      }
    }
  }, [questionType, correctAnswer]);

  // Transmettre les données au parent
  useEffect(() => {
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
    const value = e.target.value;
    setQuestionType(value);
    setCorrectAnswer('');

    if (value === 'VraiFaux') {
      setAnswers([
        { text: 'Vrai', isCorrect: false },
        { text: 'Faux', isCorrect: false }
      ]);
    } else if (value === 'ChoixMultiple') {
      setAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]);
    } else {
      setAnswers([{ text: '', isCorrect: true }]);
    }
  };

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index].text = e.target.value;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (value) => {
    setCorrectAnswer(value);
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

      <TextField
        label={`Question ${index + 1}`}
        fullWidth
        value={questionTitle}
        onChange={handleQuestionTitleChange}
        variant="outlined"
        required
        sx={{ marginBottom: '15px' }}
      />

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
                      onChange={() => {
                        const newAnswers = [...answers];
                        newAnswers[i].isCorrect = !newAnswers[i].isCorrect;
                        setAnswers(newAnswers);
                      }}
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
            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
            label="Choisir Vrai ou Faux"
          >
            <MenuItem value="Vrai">Vrai</MenuItem>
            <MenuItem value="Faux">Faux</MenuItem>
          </Select>
        </FormControl>
      )}

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
