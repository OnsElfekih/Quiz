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
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Leaderboard,
  Timer,
  School,
  Shuffle,
  Category,
  RateReview,
  MilitaryTech,
  Share,
  Feedback,
  Casino
} from '@mui/icons-material';

const featureData = [
  { icon: <Leaderboard />, title: "Tableaux des scores", description: "Classement des meilleurs scores avec des vues quotidiennes/hebdomadaires/mensuelles" },
  { icon: <Shuffle />, title: "Pool de questions aléatoires", description: "Ensembles de questions uniques pour une rejouabilité accrue" },
  { icon: <Category />, title: "Catégories de quiz", description: "Des étiquettes comme Mathématiques, Histoire pour une meilleure découverte" },
  { icon: <MilitaryTech />, title: "Réalisations", description: "Badges pour les étapes importantes et les scores parfaits" },
  { icon: <Feedback />, title: "Retour des créateurs", description: "Évaluations de la qualité des questions du quiz" },
  { icon: <Casino />, title: "Gamification", description: "Points, niveaux, et défis mini-jeux" }
];

const HomeDashboard = ({ onParticipateClick, searchTerm }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const user = useUser();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:3003/quizs/all');
        console.log(response.data)
        setQuizzes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des quizzes :', error);
      }
    };
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:3003/users/all');
      setUsers(response.data);
    };
    fetchQuizzes();
    fetchUsers();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const titre = quiz.titre?.toLowerCase() || '';
    const creator = users.find(user => user._id === quiz.creator);
    const creatorName = creator?.username?.toLowerCase() || '';
    const term = (searchTerm || '').toLowerCase();
  
    return titre.includes(term) || creatorName.includes(term);
  });
  
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
                  Créé par :  {users.find(user => user._id === quiz.creator)?.username || "Inconnu"}
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
    {/* New Perspectives section */}
    <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom color="white">
            Fonctionnalités à venir
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Améliorations intéressantes sur lesquelles nous travaillons :
          </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {featureData.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: 5, height: '100%', width: "300px" }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', mr: 2, width: 40, height: 40 }}>
                    {feature.icon}
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'center' }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', textAlign: 'center' }}>
                    {feature.description}
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="body3" color="text.secondary" fontWeight="bold">
                    À venir
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Box>
    </Box>
  );
};

export default HomeDashboard;