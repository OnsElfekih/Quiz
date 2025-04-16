import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useUser } from "./UserContext";

import LogoQuiz from "./Icons/LogoQuiz.png";
import user_icon from "./Icons/user.png";
import password_icon from "./Icons/password.png";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

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
      if (!response.ok) throw new Error(data.error || "Échec de la connexion");

      Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("id", data.user._id, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("username", formData.username, { expires: 1, secure: true, sameSite: "Strict" });

      setUser(data.user);
      navigate("/Dashboard");
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: 'linear-gradient(to bottom, #00aaff, #0044cc)',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <img src={LogoQuiz} alt="Logo" style={{ width: 250, height: 120, marginBottom: 10 }} />

        <Typography variant="subtitle1" sx={{ color: "#0044cc", fontStyle: "italic", mb: 1 }}>
          Bienvenue sur Quiz App 👋
        </Typography>

        <Typography variant="h5" fontWeight="bold" mb={2}>
          Connexion
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img src={user_icon} alt="user" style={{ width: 30, marginRight: 12 }} />
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { fontSize: 14 } }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: "#00aaff" },
                  '&.Mui-focused fieldset': { borderColor: "#0044cc" },
                },
              }}
              required
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img src={password_icon} alt="password" style={{ width: 30, marginRight: 12 }} />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { fontSize: 14 } }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: "#00aaff" },
                  '&.Mui-focused fieldset': { borderColor: "#0044cc" },
                },
              }}
              required
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: "bold",
              background: "linear-gradient(to right, #00aaff, #0044cc)",
              "&:hover": {
                background: "linear-gradient(to right, #0077cc, #0055aa)",
              },
              borderRadius: 2,
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
          </Button>
        </form>

        <Typography mt={3}>
          Pas encore de compte ?{" "}
          <Link to="/registre" style={{ color: "#0044cc", fontWeight: "bold" }}>
            Inscrivez-vous ici
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
