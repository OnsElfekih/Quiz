import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper
} from "@mui/material";

import LogoQuiz from "./Icons/LogoQuiz.png";
import user_icon from "./Icons/user.png";
import password_icon from "./Icons/password.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setMessage("Les champs ne peuvent pas être vides.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3003/users/register",
        formData
      );
      setMessage(response.data.msg);
      setFormData({ username: "", password: "" });
    } catch (error) {
      setMessage(error.response?.data?.msg || "Une erreur est survenue !");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #00aaff, #0044cc)",
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <img src={LogoQuiz} alt="Logo" style={{ width: 250, height: 120, marginBottom: 10 }} />
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Inscription
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" mb={1}>
            <img src={user_icon} alt="user" style={{ marginRight: 16, width: 24, height: 24 }} />
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <img src={password_icon} alt="password" style={{ marginRight: 16, width: 24, height: 24 }} />
            <TextField
              fullWidth
              type="password"
              label="Mot de passe"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "bold",
              background: "linear-gradient(to right, #00aaff, #0044cc)",
              '&:hover': {
                background: "linear-gradient(to right, #0077cc, #0055aa)"
              },
              borderRadius: 2,
            }}
          >
            S'inscrire
          </Button>
        </form>

        <Typography mt={3}>
          Déjà un compte ?{" "}
          <a href="/login" style={{ color: "#0044cc", fontWeight: "bold" }}>
            Connectez-vous ici
          </a>
        </Typography>

        {message && (
          <Typography
            mt={3}
            color={message.toLowerCase().includes("succès") ? "green" : "error"}
            fontWeight="medium"
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Register;
