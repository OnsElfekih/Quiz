import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, TextField, IconButton } from '@mui/material';

import LogoQuiz from './Icons/LogoQuiz.png'; // Logo
import MenuIcon from './Icons/menu.png'; // Icône de menu
import homeIcon from './Icons/home.png'; // Icône de la page d'accueil
import userIcon from './Icons/user.png'; // Exemple d'icône utilisateur
import quizzesIcon from './Icons/quizzes.png'; // Exemple d'icône de quiz
import createIcon from './Icons/create.png'; // Icône de création de quiz
import addIcon from './Icons/add.png'; // Icône de add quiz
import searchIcon from './Icons/search.png'; // Icône de search quiz
import Cookies from 'js-cookie';
import {useUser } from './UserContext';
import QuizForm from './QuizForm';
import Profile from './Profile';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  //const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const  user  = useUser();
  useEffect(() => {
    // Check if token exists in cookies
    const token = Cookies.get("token");

    if (!token) {
      navigate("/login");  // Redirect to login if no token
    }
    
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("username"); // Supprimer le nom d'utilisateur lors de la déconnexion
    window.location.href = '/login';
  };
  


  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };
  const username = Cookies.get("username"); // Récupérer le nom d'utilisateur depuis les cookies


  /* const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'ChoixMultiple',
        temps: 30,
        reponses: [{ text: '', valide: false }],
      }
    ]);
  }; */

  /* const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleResponseChange = (questionIndex, responseIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].reponses[responseIndex][field] = value;
    setQuestions(updatedQuestions);
  };
 */
  return (
    <div style={{ background: 'linear-gradient(to bottom, #00aaff, #0044cc)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, backgroundColor: 'white', boxShadow: 3 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <img src={LogoQuiz} alt="Logo" style={{ width: '70px', height: '40px' }} />
          </div>
          <div style={{ display: 'flex' }}>
            <TextField
              variant="outlined"
              placeholder="Rechercher un quiz..."
              size="small"
              sx={{
                width: 250,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
              }}
              InputProps={{
                sx: { paddingLeft: 1 }
              }}
            />
            <Button
              sx={{
                minWidth: '40px',
                padding: '6px ',
                marginLeft: '8px',
                borderRadius: '8px',
                alignItems: 'center',
                backgroundColor: '#e0e0e0',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
            >
              <img src={searchIcon} alt="Rechercher" style={{ width: 20, height: 20 }} />
            </Button>
          </div>
          <Button
            onClick={() => handleMenuClick('create-quiz')}
            sx={{
              background: 'linear-gradient(to right, #00aaff, #0044cc)', // Dégradé bleu
              color: 'white', // Texte en blanc
              borderRadius: '8px', // Bordures arrondies
              padding: '8px 16px', // Espacement autour du texte et de l'icône
              display: 'flex', // Pour aligner l'icône et le texte horizontalement
              alignItems: 'center', // Centrer l'icône et le texte verticalement
              '&:hover': {
                background: 'linear-gradient(to right, #0044cc, #00aaff)', // Inverser le dégradé au survol
              },
            }}
          >
            <img src={addIcon} alt="Ajouter" style={{ width: 20, height: 20, marginRight: '8px' }} />
            Ajouter Quiz
          </Button>
          <Typography variant="h6" sx={{ color: 'black' }}>
              Bonjour, {username ? username : 'Utilisateur'} !
            </Typography>
          <Button onClick={handleLogout} color="primary">Logout</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: 'fixed',
          top: '65px',
          left: 0,
          width: isMenuOpen ? '200px' : '50px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: 3,
          transition: 'width 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <IconButton onClick={toggleMenu}>
            <img src={MenuIcon} alt="Menu" style={{ width: 30, height: 30 }} />
            {isMenuOpen && <Typography sx={{ marginLeft: '10px' }}>Menu</Typography>}
          </IconButton>
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: currentPage === 'home' ? 'linear-gradient(to right, #00aaff, #0044cc)' : 'transparent',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#00bfff',
              },
            }}
            onClick={() => handleMenuClick('home')}
          >
            <img src={homeIcon} alt="Home" style={{ width: 30, height: 30 }} />
            {isMenuOpen && <Typography sx={{ marginLeft: '10px' }}>Home</Typography>}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: currentPage === 'profile' ? 'linear-gradient(to right, #00aaff, #0044cc)' : 'transparent',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#00bfff',
              },
            }}
            onClick={() => handleMenuClick('profile')}
          >
            <img src={userIcon} alt="Profile" style={{ width: 30, height: 30 }} />
            {isMenuOpen && <Typography sx={{ marginLeft: '10px' }}>Profile</Typography>}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: currentPage === 'my-quizzes' ? 'linear-gradient(to right, #00aaff, #0044cc)' : 'transparent',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#00bfff',
              },
            }}
            onClick={() => handleMenuClick('my-quizzes')}
          >
            <img src={quizzesIcon} alt="Quizzes" style={{ width: 30, height: 30 }} />
            {isMenuOpen && <Typography sx={{ marginLeft: '10px' }}>Mes quizzes</Typography>}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: currentPage === 'create-quiz' ? 'linear-gradient(to right, #00aaff, #0044cc)' : 'transparent',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#00bfff',
              },
            }}
            onClick={() => handleMenuClick('create-quiz')}
          >
            <img src={createIcon} alt="Create Quiz" style={{ width: 30, height: 30 }} />
            {isMenuOpen && <Typography sx={{ marginLeft: '10px' }}>Créer un quiz</Typography>}
          </Box>
        </Box>
      </Box>

      <Container sx={{ marginTop: '150px', marginLeft: isMenuOpen ? '350px' : '150px', transition: 'margin-left 0.3s ease' }}>
        {currentPage === 'home' && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ padding: '20px', borderRadius: '8px', boxShadow: 0 }}>
                <Typography variant="h5" color="white" gutterBottom>
                  Participer aux quizzes
                </Typography>
                <Grid container spacing={2}>
                  {[1, 2, 3, 4].map((quiz, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          padding: '16px',
                          boxShadow: 3,
                          '&:hover': {
                            boxShadow: 6,
                          },
                        }}
                      >
                        <Typography variant="h6">Quiz {index + 1}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Description du quiz {index + 1}.
                        </Typography>
                        <Button sx={{ marginTop: '10px' }}>Participer</Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        )}

        {currentPage === 'profile' && <Profile/>}

        {currentPage === 'my-quizzes' && (
          <Box sx={{ padding: 2, backgroundColor: 'transparent', borderRadius: 2 }}>
            <Typography variant="h5" color="white" gutterBottom>
              Mes Quizzes
            </Typography>
            <Typography variant="body1" color="white">Liste des quizzes créés</Typography>
          </Box>
        )}

      {currentPage === 'create-quiz' && <QuizForm creator={username} />}
      </Container>
    </div>
  );
};

export default Dashboard;
