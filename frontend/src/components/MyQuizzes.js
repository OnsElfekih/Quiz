import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import Cookies from 'js-cookie';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

const MyQuizzes = ({ onEditClick, searchTerm = '' }) => {
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const user = useUser(); // Get the current logged-in user

  useEffect(() => {
    const userid = user._id || Cookies.get('id');
    if (!userid) return;

    const fetchCreatedQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/quizs/quizs/createdBy/${userid}`);
        setCreatedQuizzes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des quizzes créés :', error);
      }
    };

    const fetchCompletedQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/quizresponse/completed-quizzes/${userid}`);
        setCompletedQuizzes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des quizzes complétés :', error);
      }
    };

    fetchCreatedQuizzes();
    fetchCompletedQuizzes();
  }, [user._id]);

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:3003/quizs/delete/${quizId}`);
      // Remove the quiz from the state after deletion
      setCreatedQuizzes((prevQuizzes) => prevQuizzes.filter(quiz => quiz._id !== quizId));
    } catch (error) {
      console.error('Erreur lors de la suppression du quiz :', error);
    }
  };

  const filteredCreatedQuizzes = createdQuizzes.filter((quiz) => {
    if (!quiz.titre || typeof quiz.titre !== 'string') return false;
    if (!searchTerm || typeof searchTerm !== 'string') return true;
    return quiz.titre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredCompletedQuizzes = completedQuizzes.filter((quizResponse) => {
    if (!quizResponse.quizId || !quizResponse.quizId.titre) return false;
    if (!searchTerm || typeof searchTerm !== 'string') return true;
    return quizResponse.quizId.titre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="white" gutterBottom>
        Mes Quizzes Créés
      </Typography>
      <Grid container spacing={3}>
        {filteredCreatedQuizzes.length === 0 ? (
          <Typography variant="body1" color="white">Aucun quiz trouvé.</Typography>
        ) : (
          filteredCreatedQuizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {quiz.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nombre de questions : {quiz.nbQuestions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score total : {quiz.score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Temps total : {quiz.time}s
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        console.log("Edit clicked for quiz:", quiz._id);
                        onEditClick(quiz._id);
                      }}
                    >
                      Éditer
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ ml: 2 }}
                      onClick={() => deleteQuiz(quiz._id)}
                    >
                      Supprimer
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Typography variant="h4" color="white" gutterBottom sx={{ mt: 5 }}>
        Mes Quizzes Complétés
      </Typography>
      <Grid container spacing={3}>
        {filteredCompletedQuizzes.length === 0 ? (
          <Typography variant="body1" color="white">Aucun quiz complété trouvé.</Typography>
        ) : (
          filteredCompletedQuizzes.map((quizResponse) => (
            <Grid item xs={12} sm={6} md={4} key={quizResponse._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {quizResponse.quizId.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score obtenu : {quizResponse.score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complété le : {new Date(quizResponse.completedAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default MyQuizzes;
