import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get('token');
      console.log("Contenu du token :", token);
      console.log("Token length:", token?.length);
      try {
        const response = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUserData(response.data);
      } catch (err) {
        console.log('Full error object:', err);
        console.error('Erreur lors de la récupération du profil :', err.response?.data || err.message);
        setError('Erreur lors du chargement du profil.');
      }
    };
    
    fetchUserProfile();
  }, []);
  
  

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!userData) {
    return <Typography variant="h6" color="white">Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: 'transparent', borderRadius: 2 }}>
      <Typography variant="h5" color="white" gutterBottom>
        Mon Profil
      </Typography>
      <Typography variant="body1" color="white">Nom d'utilisateur: {userData.username}</Typography>
      <Typography variant="body1" color="white">Email: {userData.email}</Typography>
    </Box>
  );
};

export default Profile;
