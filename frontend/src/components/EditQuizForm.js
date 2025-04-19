import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Typography, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { AccessTime, Score, Person, AddCircleOutline } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';
import Question from './Question';

const EditQuizForm = ({ quizId})=> {
  //const  quizId  = useParams();
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

  // Load existing quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        console.log("Fetching quiz with ID:", quizId);
        const response = await fetch(`http://localhost:3003/quizs/${quizId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data) {
          throw new Error('No quiz data received');
        }

        setQuizTitle(data.titre || '');
        setQuestions(data.questions || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading quiz:', error);
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

  // Calculate total score and time
  useEffect(() => {
    const score = questions.reduce((acc, q) => acc + (parseInt(q.score) || 0), 0);
    const time = questions.reduce((acc, q) => acc + (parseInt(q.temps) || 0), 0);
    setTotalScore(score);
    setTotalTime(time);
  }, [questions]);

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      text: '',
      type: 'ChoixMultiple',
      reponses: [],
      score: 0,
      temps: 10
    }]);
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
        temps: parseInt(question.temps) || 10,
      })),
    };

    try {
      const response = await fetch(`http://localhost:3003/quizs/edit/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
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
      
      //setTimeout(() => navigate('/quizzes'), 1500);
    } catch (error) {
      console.error('Error updating quiz:', error);
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
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
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
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
            <Button 
              onClick={handleAddQuestion} 
              variant="contained" 
              size="small" 
              sx={{ mt: 1 }}
            >
              + Question
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Quiz Title Field */}
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
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Render Questions */}
      {questions.map((question, index) => (
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
            questionData={question}
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
              backgroundColor: '#0044cc',
            },
          }}
        >
          Update Quiz
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditQuizForm;