import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Card, CardContent, RadioGroup,
  Radio, FormControlLabel, Button, TextField, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CheckIcon from '@mui/icons-material/Check';

const ParticipateQuiz = ({ quizId, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isQuizActive, setIsQuizActive] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:3003/quizs/${quizId}`);
        setQuiz(res.data);
        setTimeLeft(res.data.questions[0]?.temps || 30);
      } catch (err) {
        console.error('Error loading quiz:', err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!isQuizActive || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? handleTimeout() : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex, isQuizActive, quiz]);

  const handleTimeout = () => {
    handleNextQuestion();
    return quiz.questions[currentQuestionIndex + 1]?.temps || 30;
  };

  const handleSelectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswerIndex(answerIndex);
  };

  const handleShortAnswer = (questionIndex, answerText) => {
    setAnswers({
      ...answers,
      [questionIndex]: { text: answerText }
    });
  };

  const checkShortAnswerCorrectness = (userAnswer, possibleAnswers) => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    return possibleAnswers.some(
      (rep) => rep.text.trim().toLowerCase() === normalizedUserAnswer
    );
  };

  const handleNextQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    let isCorrect = false;

    if ((currentQuestion.type === "SeuleReponse" || currentQuestion.type === "ChoixMultiple" || currentQuestion.type === "VraiFaux") && selectedAnswerIndex !== null) {
      isCorrect = currentQuestion.reponses[selectedAnswerIndex]?.isCorrect;
      setAnswers({ ...answers, [currentQuestionIndex]: selectedAnswerIndex });
    } else if (currentQuestion.type === "ReponsesCourtes") {
      const userAnswer = answers[currentQuestionIndex]?.text || '';
      isCorrect = checkShortAnswerCorrectness(userAnswer, currentQuestion.reponses);
      setAnswers({ ...answers, [currentQuestionIndex]: { text: userAnswer, isCorrect } });
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswerIndex(null);
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(quiz.questions[currentQuestionIndex + 1].temps);
      } else {
        handleSubmit();
      }
    }, 1000);
  };

  const handleSubmit = () => {
    setIsQuizActive(false);
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (!userAnswer) return;
      if ((question.type === "SeuleReponse" || question.type === "ChoixMultiple") && question.reponses[userAnswer]?.isCorrect) {
        score += question.score;
      } else if (question.type === "ReponsesCourtes" && userAnswer.isCorrect) {
        score += question.score;
      } else if (question.type === "VraiFaux" && question.reponses[userAnswer]?.isCorrect) {
        score += question.score;
      }
    });
    setTotalScore(score);
    setOpenModal(true);
  };

  if (!quiz) return <Typography>Loading...</Typography>;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, height: 10, borderRadius: 5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="white">
          Question {currentQuestionIndex + 1}/{quiz.questions.length}
        </Typography>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={(timeLeft / currentQuestion.temps) * 100} size={48} thickness={5} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {timeLeft}s
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 2, borderRadius: 4, boxShadow: 6, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>{currentQuestion.text}</Typography>
          {(currentQuestion.type === "SeuleReponse" || currentQuestion.type === "ChoixMultiple") ? (
            <RadioGroup
              value={selectedAnswerIndex ?? ''}
              onChange={(e) => handleSelectAnswer(currentQuestionIndex, parseInt(e.target.value))}
            >
              {currentQuestion.reponses.map((rep, repIndex) => (
                <FormControlLabel
                  key={repIndex}
                  value={repIndex}
                  control={<Radio />}
                  label={rep.text}
                />
              ))}
            </RadioGroup>
          ) : currentQuestion.type === "ReponsesCourtes" ? (
            <TextField
              fullWidth
              variant="outlined"
              value={answers[currentQuestionIndex]?.text || ''}
              onChange={(e) => handleShortAnswer(currentQuestionIndex, e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNextQuestion()}
              placeholder="Tapez votre réponse..."
              sx={{ mt: 2 }}
            />
          ) : currentQuestion.type === "VraiFaux" ? (
            <RadioGroup
              value={selectedAnswerIndex ?? ''}
              onChange={(e) => handleSelectAnswer(currentQuestionIndex, parseInt(e.target.value))}
            >
              <FormControlLabel value={0} control={<Radio />} label="Vrai" />
              <FormControlLabel value={1} control={<Radio />} label="Faux" />
            </RadioGroup>
          ) : (
            <Typography color="error">Unsupported question type</Typography>
          )}
          {feedback && (
            <Typography sx={{ mt: 1 }} color={feedback === 'correct' ? 'green' : 'red'}>
              {feedback === 'correct' ? '✅ Bonne réponse !' : '❌ Mauvaise réponse'}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleNextQuestion}
          startIcon={<CheckIcon />}
          sx={{
            backgroundColor: '#00aaff',
            borderRadius: '8px',
            color: 'white',
            px: '30px',
            py: '12px',
            fontWeight: 'bold',
            mt: 2,
            boxShadow: 3,
            '&:hover': { backgroundColor: '#0044cc' },
          }}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Suivant' : 'Terminer'}
        </Button>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Résultat du Quiz</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Score: {totalScore}/{quiz.score}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onBack}>Retour à la liste</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParticipateQuiz;
