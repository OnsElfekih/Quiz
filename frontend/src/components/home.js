import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


import LogoQuiz from './Icons/LogoQuiz.png';

const Home = () => {
    return (
        <div style={{
            background: 'linear-gradient(0deg, #2196F3,rgb(68, 134, 242))',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
        }}>
            {/* Logo */}
            <img src={LogoQuiz} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />

            {/* Message d'accueil */}
            <Typography variant="h3" gutterBottom>
                Bienvenue sur notre application !
            </Typography>
            <Typography variant="h6" paragraph>
                Découvrez un monde d'opportunités. Commencez dès maintenant en vous inscrivant ou en vous connectant.
            </Typography>

            {/* Bouton de navigation */}
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                        mt: 2,
                        background: 'linear-gradient(to right, #00aaff, #0044cc)', 
                        '&:hover': {
                            background: 'linear-gradient(to right, #0077cc, #0055aa)' 
                        }
                        }}>
                    Se connecter
                </Button>
            </Link>

            {/* Bouton pour s'inscrire */}
            <Link to="/registre" style={{ textDecoration: 'none', marginTop: '20px' }}>
                <Button variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                        mt: 2,
                        background: 'linear-gradient(to right, #00aaff, #0044cc)', 
                        '&:hover': {
                            background: 'linear-gradient(to right, #0077cc, #0055aa)' 
                        }
                        }}>
                    S'inscrire
                </Button>
            </Link>
        </div>
    );
};

export default Home;
