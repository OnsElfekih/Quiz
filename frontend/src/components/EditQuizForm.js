import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Radio,
} from '@mui/material';
import { AccessTime, Score, Person, AddCircleOutline } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';

const EditQuizForm = ({ quizId }) => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const user = useUser();

  const handleLoadQuestions = (rawQuestions = []) => {
    const normalized = rawQuestions.map((q, index) => {
      const base = {
        text: q.text || '',
        type: q.type || 'ChoixMultiple',
        temps: q.temps || 10,
        score: q.score || 0
      };

      let reponses = [];

      switch (base.type) {
        case 'VraiFaux':
          reponses = [
            { text: 'Vrai', isCorrect: q.reponses?.find(r => r.text === 'Vrai')?.isCorrect || false },
            { text: 'Faux', isCorrect: q.reponses?.find(r => r.text === 'Faux')?.isCorrect || false }
          ];
          break;

        case 'ChoixMultiple':
        case 'SeuleReponse':
        case 'Correspondance':
          reponses = Array.isArray(q.reponses) && q.reponses.length
            ? q.reponses.map(r => ({ text: r.text || '', isCorrect: !!r.isCorrect }))
            : [{ text: '', isCorrect: false }, { text: '', isCorrect: false }];
          break;

        case 'ReponsesCourtes':
          reponses = q.reponses?.length
            ? q.reponses.map(r => ({ text: r.text || '', isCorrect: false }))
            : [{ text: '', isCorrect: false }];
          break;

        default:
          reponses = [];
      }

      return { ...base, reponses };
    });

    setQuestions(normalized);
  };

  useEffect(() => {
    console.log("userId: ",user.user._id);
    console.log("username: ",user.user.username);
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3003/quizs/${quizId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data) throw new Error('No quiz data received');

        setQuizTitle(data.titre || '');
        handleLoadQuestions(data.questions || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Failed to load quiz',
          severity: 'error'
        });
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    const score = questions.reduce((acc, q) => acc + (parseInt(q.score) || 0), 0);
    const time = questions.reduce((acc, q) => acc + (parseInt(q.temps) || 0), 0);
    setTotalScore(score);
    setTotalTime(time);
  }, [questions]);

  const handleAddQuestion = (questionData = null) => {
    const newQuestion = questionData
      ? { ...questionData }
      : {
          text: '',
          type: 'ChoixMultiple',
          reponses: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          score: 0,
          temps: 10
        };

    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index) => {
    if (window.confirm('Are you sure you want to remove this question?')) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, updatedAnswer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].reponses[answerIndex] = updatedAnswer;
    setQuestions(updatedQuestions);
  };

  const handleUpdateQuiz = async () => {
    if (!quizTitle.trim()) {
      setSnackbar({
        open: true,
        message: 'Quiz title is required',
        severity: 'error'
      });
      return;
    }

    if (questions.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one question',
        severity: 'error'
      });
      return;
    }

    const quizData = {
      titre: quizTitle,
      nbQuestions: questions.length,
      creator: user.user._id,
      time: totalTime,
      score: totalScore,
      questions: questions.map((question) => ({
        text: question.text,
        type: question.type,
        reponses: question.reponses || [],
        score: parseInt(question.score) || 0,
        temps: parseInt(question.temps) || 10
      }))
    };
    console.log("userId: ",user.user._id);
    console.log("username: ",user.user.username);
    try {
      const response = await fetch(`http://localhost:3003/quizs/edit/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update quiz');
      }

      setSnackbar({
        open: true,
        message: 'Quiz updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error updating quiz',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading quiz: {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Typography variant="h5" color="white" sx={{ marginBottom: '20px' }}>
        Edit Quiz
      </Typography>

      <Box sx={{ position: 'fixed', top: '120px', right: '20px', display: 'flex', flexDirection: 'column', gap: 1, zIndex: 1000 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <Score color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Total Score</Typography>
            <Typography variant="h6">{totalScore}</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <AccessTime color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Total Time</Typography>
            <Typography variant="h6">{totalTime} s</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <Person color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Creator</Typography>
            <Typography variant="h6">{user.user?.username || 'Unknown'}</Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 2, textAlign: 'center', width: '120px' }}>
            <AddCircleOutline color="primary" />
            <Typography variant="subtitle2" color="textSecondary">Add</Typography>
            <Button onClick={handleAddQuestion} variant="contained" size="small" sx={{ mt: 1 }}>
              + Question
            </Button>
          </Box>
        </motion.div>
      </Box>

      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <TextField
            label="Quiz Title"
            fullWidth
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' }
              },
              '& .MuiInputLabel-root': { color: 'white' }
            }}
          />
        </Grid>
      </Grid>

      {questions.map((question, index) => (
        <Box key={index} sx={{ 
          padding: '20px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: '#ffffff'
        }}>
          <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
            <Grid item xs={8}>
              <TextField
                select
                fullWidth
                label="Type de question"
                value={question.type}
                onChange={(e) => handleQuestionChange(index, { ...question, type: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="ChoixMultiple">Choix Multiple</MenuItem>
                <MenuItem value="ReponsesCourtes">Réponse Courte</MenuItem>
                <MenuItem value="VraiFaux">Vrai/Faux</MenuItem>
                <MenuItem value="SeuleReponse">Seule Réponse</MenuItem>
                <MenuItem value="Correspondance">Correspondance</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Score"
                type="number"
                fullWidth
                value={question.score}
                onChange={(e) => handleQuestionChange(index, { ...question, score: e.target.value })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Durée (s)"
                type="number"
                fullWidth
                value={question.temps}
                onChange={(e) => handleQuestionChange(index, { ...question, temps: parseInt(e.target.value) })}
                inputProps={{ min: 5 }}
              />
            </Grid>
          </Grid>

          <TextField
            label={`Question ${index + 1}`}
            fullWidth
            value={question.text}
            onChange={(e) => handleQuestionChange(index, { ...question, text: e.target.value })}
            variant="outlined"
            required
            sx={{ marginBottom: '15px' }}
          />

          {question.type === 'ChoixMultiple' && (
            <>
              {question.reponses.map((answer, answerIndex) => (
                <Grid container spacing={2} key={answerIndex} sx={{ marginBottom: '10px' }}>
                  <Grid item xs={10}>
                    <TextField
                      label={`Réponse ${answerIndex + 1}`}
                      fullWidth
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(index, answerIndex, { ...answer, text: e.target.value })}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={answer.isCorrect}
                          onChange={(e) => handleAnswerChange(index, answerIndex, { ...answer, isCorrect: e.target.checked })}
                          color="primary"
                        />
                      }
                      label="Correct"
                    />
                  </Grid>
                </Grid>
              ))}
            </>
          )}

          {question.type === 'VraiFaux' && (
            <Box sx={{ marginTop: '15px' }}>
              {question.reponses.map((answer, answerIndex) => (
                <FormControlLabel
                  key={answerIndex}
                  control={
                    <Radio
                      checked={answer.isCorrect}
                      onChange={() => {
                        const updatedReponses = question.reponses.map((r, i) => ({
                          ...r,
                          isCorrect: i === answerIndex
                        }));
                        handleQuestionChange(index, { ...question, reponses: updatedReponses });
                      }}
                      color="primary"
                    />
                  }
                  label={answer.text}
                  sx={{ display: 'block', ml: 0 }}
                />
              ))}
            </Box>
          )}

          {['ReponsesCourtes', 'SeuleReponse', 'Correspondance'].includes(question.type) && (
            <TextField
              label="Réponse correcte"
              fullWidth
              value={question.reponses[0]?.text || ''}
              onChange={(e) => handleAnswerChange(index, 0, { text: e.target.value, isCorrect: true })}
              variant="outlined"
              required
              sx={{ marginTop: '15px' }}
            />
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRemoveQuestion(index)}
            sx={{ marginTop: '20px' }}
          >
            Supprimer la question
          </Button>
        </Box>
      ))}

      <Box sx={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
        <Button
          variant="contained"
          onClick={handleUpdateQuiz}
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
              backgroundColor: '#0044cc'
            }
          }}
        >
          Update Quiz
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditQuizForm;
