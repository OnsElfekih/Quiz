import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

const HomeDashboard = ({ onParticipateClick, searchTerm }) => {
  const [quizzes, setQuizzes] = useState([]);
  const user = useUser();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:3003/quizs/all');
        setQuizzes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des quizzes :', error);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="white">
        Tous les Quizzes Disponibles
      </Typography>
      <Grid container spacing={3}>
        {filteredQuizzes.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {quiz.titre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Créé par : {user.user.username}
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
                    onClick={() => onParticipateClick(quiz._id)}
                  >
                    Participer
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomeDashboard;
