import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";

import LogoQuiz from './Icons/LogoQuiz.png';
import user_icon from './Icons/user.png';
import password_icon from './Icons/password.png';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3003/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Échec de la connexion");
      }
  
      // Store the token and role in cookies
      Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("role", data.role, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("username", formData.username, { expires: 1, secure: true, sameSite: "Strict" });

  
      navigate("/Dashboard");  // Redirect after login
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <div style={{ alignItems: 'center', justifyContent: 'center' }}>
        <img src={LogoQuiz} alt="Logo" style={{ width: '300px', height: '150px' }} />
        <Typography variant="h5" mb={2}>
          Connexion
        </Typography>
      </div>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '20px' }}>
            <img src={user_icon} alt="" />
          </div>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '20px' }}>
            <img src={password_icon} alt="" />
          </div>
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            background: 'linear-gradient(to right, #00aaff, #0044cc)', 
            '&:hover': {
              background: 'linear-gradient(to right, #0077cc, #0055aa)' 
            }
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
        </Button>
      </form>

      <Typography mt={2}>
        Pas encore de compte ?{" "}
        <Link to="/registre" style={{ color: "blue", textDecoration: "underline" }}>
          Inscrivez-vous ici
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
