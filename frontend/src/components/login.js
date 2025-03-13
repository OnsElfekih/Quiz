import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
const Login = () => {
const [formData, setFormData] = useState({ username: "", password: "" });
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const navigate = useNavigate(); // Pour rediriger après connexion
const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
    const response = await fetch("http://localhost:3001/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Échec de la connexion");
// Stockage du token et rôle dans les cookies
Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "Strict" });
Cookies.set("role", data.role, { expires: 1, secure: true, sameSite: "Strict" });
navigate("/home"); // Redirection après connexion
} catch (err) {
setError(err.message);
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
    <Typography variant="h5" mb={2}>
    Connexion
    </Typography>
    {error && <Typography color="error">{error}</Typography>}
    <form onSubmit={handleSubmit}>
<TextField
fullWidth
label="username"
type="String"
name="username"
value={formData.username}
onChange={handleChange}
margin="normal"
required
/>
<TextField
fullWidth
label="Mot de passe"
type="password"
name="password"
value={formData.password}
onChange={handleChange}
margin="normal"
required
/>
<Button
type="submit"
variant="contained"
color="primary"
fullWidth
sx={{ mt: 2 }}
disabled={loading}
>
{loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
</Button>
</form>
<Typography mt={2}>
Pas encore de compte ?{" "}
<Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
Inscrivez-vous ici
</Link>
</Typography>
</Box>
);
};
export default Login;