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
  const [quizzes, setQuizzes] = useState([]);
  const user = useUser(); // Get the current logged-in user

  useEffect(() => {
    const userid = user._id || Cookies.get('id');
    console.log("useridddd"+userid)
    if (!userid) return;
  
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/quizs/quizs/createdBy/${userid}`);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des quizzes :', error);
      }
    };
  
    fetchQuizzes();
  }, [user._id]);
  
  

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (!quiz.titre || typeof quiz.titre !== 'string') return false;
    if (!searchTerm || typeof searchTerm !== 'string') return true;
    return quiz.titre.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="white" gutterBottom>
        Mes Quizzes
      </Typography>
      <Grid container spacing={3}>
      {filteredQuizzes.length === 0 ? (
  <Typography variant="body1" color="white">Aucun quiz trouvé.</Typography>
) : (
  filteredQuizzes.map((quiz) => (
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
              onClick={() => onEditClick(quiz._id)}
            >
              Éditer
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  ))
)}

      </Grid>
    </Box>
  );
};

export default MyQuizzes;
