import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

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
    try {
      const response = await axios.post(
        "http://localhost:3003/users/register",
        formData
      );
      setMessage(response.data.msg);
      setFormData({ username: "", password: ""}); // Réinitialisation des champs
    } catch (error) {
      setMessage(error.response?.data?.msg || "Un erreur est survenue !");
    }
  };

  return (
    <Box
sx={{
maxWidth: 400,
mx: "auto",
mt: 5,
p: 3,
boxShadow: 3,
borderRadius: 2,
backgroundColor: "white",
}}
>
<Typography variant="h5" mb={2} textAlign="center">
Inscription
</Typography>
<form onSubmit={handleSubmit}>
<TextField
fullWidth
label="Nom d'utilisateur"
name="username"
value={formData.username}
onChange={handleChange}
margin="normal"
required
/>
<TextField
fullWidth
type="password"
label="Mot de passe"
name="password"
value={formData.password}
onChange={handleChange}
margin="normal"
required
/><Typography textAlign="center" mt={2}>
  Déjà un compte ?{" "}
  <a href="/login" style={{ color: "blue", textDecoration: "none" }}>
    Connectez-vous ici
  </a>
</Typography>

<Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
S'inscrire
</Button>
</form>
{message && (
<Typography color="error" textAlign="center" mt={2}>
{message}
</Typography>
)}
</Box>
);
};
export default Register;

