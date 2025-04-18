import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid, MenuItem, IconButton, Checkbox, FormControlLabel, Select, InputLabel, FormControl,
} from '@mui/material';
import { AccessTime, Score, AddCircleOutline } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const EditQuizForm = ({ quizId }) => {
  const [quizData, setQuizData] = useState(null);
  const [titre, setTitre] = useState('');
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (quizId) {
      axios.get(`http://localhost:3003/quizs/${quizId}`)
        .then(res => {
          const quiz = res.data;
          setQuizData(quiz);
          setTitre(quiz.titre);
          setQuestions(quiz.questions);
          setScore(quiz.score);
          setTime(quiz.time);
        })
        .catch(err => {
          console.error("Erreur lors de la récupération du quiz :", err);
        });
    }
  }, [quizId]);

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;

    if (key === 'type') {
      if (value === 'VraiFaux') {
        updatedQuestions[index].reponses = [
          { text: 'Vrai', isCorrect: true },
          { text: 'Faux', isCorrect: false },
        ];
      } else if (value === 'ReponsesCourtes') {
        updatedQuestions[index].reponses = [{ text: '', isCorrect: true }];
      } else {
        updatedQuestions[index].reponses = [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ];
      }
    }

    setQuestions(updatedQuestions);
  };

  const handleReponseChange = (qIndex, rIndex, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].reponses[rIndex][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSave = () => {
    const updatedQuiz = {
      ...quizData,
      titre,
      score: questions.reduce((acc, q) => acc + Number(q.score || 0), 0),
      time: questions.reduce((acc, q) => acc + Number(q.temps || 0), 0),
      nbQuestions: questions.length,
      questions,
    };

    axios.put(`http://localhost:3003/quizs/edit/${quizId}`, updatedQuiz)
      .then(() => alert('Quiz mis à jour !'))
      .catch(err => console.error("Erreur lors de la mise à jour :", err));
  };

  if (!quizData) return <div>Chargement...</div>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Modifier le Quiz</Typography>
      <TextField
        fullWidth
        label="Titre du Quiz"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ position: 'fixed', right: 20, top: 100, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2 }}>
          <Score color="primary" />
          <Typography variant="subtitle2">Score Total</Typography>
          <Typography variant="h6">{score}</Typography>
        </Box>
        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2 }}>
          <AccessTime color="primary" />
          <Typography variant="subtitle2">Temps Total</Typography>
          <Typography variant="h6">{time} s</Typography>
        </Box>
        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2 }}>
          <AddCircleOutline color="primary" />
          <Typography variant="subtitle2">Ajouter</Typography>
          <Button variant="contained" onClick={() => setQuestions([...questions, { text: '', type: 'ChoixMultiple', temps: 0, score: 0, reponses: [] }])}>+ Question</Button>
        </Box>
      </Box>

      {questions.map((q, qIndex) => (
        <Box key={qIndex} sx={{ border: '1px solid gray', borderRadius: 2, p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Texte de la question"
                value={q.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={q.type}
                  label="Type"
                  onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                >
                  <MenuItem value="ChoixMultiple">Choix Multiple</MenuItem>
                  <MenuItem value="SeuleReponse">Seule Réponse</MenuItem>
                  <MenuItem value="ReponsesCourtes">Réponse Courte</MenuItem>
                  <MenuItem value="VraiFaux">Vrai / Faux</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                type="number"
                fullWidth
                label="Temps (s)"
                value={q.temps}
                onChange={(e) => handleQuestionChange(qIndex, 'temps', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                type="number"
                fullWidth
                label="Score"
                value={q.score}
                onChange={(e) => handleQuestionChange(qIndex, 'score', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton onClick={() => handleRemoveQuestion(qIndex)}><DeleteIcon /></IconButton>
            </Grid>
          </Grid>

          {q.type === 'ReponsesCourtes' ? (
            <TextField
              fullWidth
              label="Réponse attendue"
              value={q.reponses[0]?.text || ''}
              onChange={(e) => handleReponseChange(qIndex, 0, 'text', e.target.value)}
              sx={{ mt: 2 }}
            />
          ) : q.type === 'VraiFaux' ? (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Réponse correcte</InputLabel>
              <Select
                value={q.reponses.find(r => r.isCorrect)?.text || ''}
                label="Réponse correcte"
                onChange={(e) => {
                  const value = e.target.value;
                  const newReponses = q.reponses.map(r => ({ ...r, isCorrect: r.text === value }));
                  const updated = [...questions];
                  updated[qIndex].reponses = newReponses;
                  setQuestions(updated);
                }}
              >
                <MenuItem value="Vrai">Vrai</MenuItem>
                <MenuItem value="Faux">Faux</MenuItem>
              </Select>
            </FormControl>
          ) : (
            q.reponses.map((rep, rIndex) => (
              <Grid container spacing={2} key={rIndex} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label={`Réponse ${rIndex + 1}`}
                    value={rep.text}
                    onChange={(e) => handleReponseChange(qIndex, rIndex, 'text', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rep.isCorrect || false}
                        onChange={(e) => handleReponseChange(qIndex, rIndex, 'isCorrect', e.target.checked)}
                      />
                    }
                    label="Correct"
                  />
                </Grid>
              </Grid>
            ))
          )}
        </Box>
      ))}

      <Box sx={{ textAlign: 'right', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default EditQuizForm;