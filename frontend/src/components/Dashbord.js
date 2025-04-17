import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, TextField, IconButton } from '@mui/material';
import LogoQuiz from './Icons/LogoQuiz.png';
import MenuIcon from './Icons/menu.png';
import homeIcon from './Icons/home.png';
import userIcon from './Icons/user.png';
import quizzesIcon from './Icons/quizzes.png';
import createIcon from './Icons/create.png';
import addIcon from './Icons/add.png';
import searchIcon from './Icons/search.png';
import Cookies from 'js-cookie';
import { useUser } from './UserContext';
import QuizForm from './QuizForm';
import Profile from './Profile';
import HomeDashboard from './HomeDashboard';
import ParticipateQuiz from './ParticipateQuiz';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyQuizzes from './MyQuizzes';

const Dashboard = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = useUser();
  
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("username");
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (page) => {
    setSelectedQuizId(null); // Reset selected quiz when changing pages
    setCurrentPage(page);
  };

  const username = Cookies.get("username");

  return (
    <div style={{ background: 'linear-gradient(to bottom, #00aaff, #0044cc)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, backgroundColor: 'white', boxShadow: 3 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <img src={LogoQuiz} alt="Logo" style={{ width: '70px', height: '40px' }} />
          </div>
          <div style={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>
          <Button
            onClick={() => handleMenuClick('create-quiz')}
            sx={{
              background: 'linear-gradient(to right, #00aaff, #0044cc)',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                background: 'linear-gradient(to right, #0044cc, #00aaff)',
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
              backgroundColor: currentPage === 'home' ? '#00aaff' : 'transparent',
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
              backgroundColor: currentPage === 'profile' ? '#00aaff' : 'transparent',
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
              backgroundColor: currentPage === 'my-quizzes' ? '#00aaff' : 'transparent',
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
              backgroundColor: currentPage === 'create-quiz' ? '#00aaff' : 'transparent',
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
        {currentPage === 'home' && !selectedQuizId && (
          <HomeDashboard
            onParticipateClick={(quizId) => {
              setSelectedQuizId(quizId);
              setCurrentPage('participate-quiz');
            }}
            searchTerm={searchTerm}
          />
      )}

      {currentPage === 'participate-quiz' && selectedQuizId && (
        <ParticipateQuiz quizId={selectedQuizId} 
        onBack={() => {
          setSelectedQuizId(null);
          setCurrentPage('home');
        }}
        />
      )}
        {currentPage === 'profile' && <Profile/>}

        {currentPage === 'my-quizzes' && <MyQuizzes/>}
        {currentPage === 'create-quiz' && <QuizForm creator={username} />}
        </Container>
      </div>
  );
};

export default Dashboard;
