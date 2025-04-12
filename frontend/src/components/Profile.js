import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Person, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { useUser } from './UserContext';

const Profile = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const user = useUser();

  const handleChangerMdp = async () => {
    const url = `http://localhost:3003/users/${user.user._id}/change-password`;
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const response = await axios.put(url, data);
      setMessage('Mot de passe changé avec succès!');
      setOldPassword('');
      setNewPassword('');
      console.log('Password changed successfully:', response.data);
    } catch (error) {
      setMessage('Erreur lors du changement de mot de passe!');
      console.error('Error changing password:', error.response?.data || error.message);
    }
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'transparent', borderRadius: 2 }}>
      <Typography variant="h3" color="white" gutterBottom>
        Mon Profil
      </Typography>

      <Box sx={{
        backgroundColor: 'transparent',
        width: '60%',
        padding: 1,
        borderRadius: 2,
        textAlign: 'center',
        display: 'flex',
        gap: 2
      }}>
        <Person sx={{ color: 'white', fontSize: 30 }} />
        <Typography variant="h5" color="white">
          <b>Nom d'utilisateur:</b> {user.user.username}
        </Typography>
      </Box>

      <Box sx={{
        backgroundColor: 'transparent',
        width: '60%',
        padding: 1,
        borderRadius: 2,
        textAlign: 'center',
        display: 'flex',
        gap: 2
      }}>
        <Password sx={{ color: 'white', fontSize: 30 }} />
        <Typography variant="h5" color="white">
          <b>Mot de passe:</b> ********
        </Typography>
      </Box>

      <Box mt={2}>
        <Button
          variant="contained"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          startIcon={<Password />}
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
          Changer mot de passe
        </Button>
      </Box>

      {showPasswordForm && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '60%' }}>
          <TextField
            type={showOldPassword ? 'text' : 'password'}
            label="Ancien mot de passe"
            variant="outlined"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            type={showNewPassword ? 'text' : 'password'}
            label="Nouveau mot de passe"
            variant="outlined"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={handleChangerMdp}
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
            Valider
          </Button>

          {message && (
            <Typography color={message.includes("succès") ? "green" : "error"}>
              {message}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Profile;
