const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");

const jwt = require("jsonwebtoken");

const User = require("../../models/User");



// @route GET api/users/me
// @desc Récupérer les infos de l'utilisateur connecté
// @access Privé

router.get("/me",  async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

  


// @route POST api/users/register
// @desc Register new user
// @access Public
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    console.log("Registration request received");
    if (!username || !password) {
        return res.status(400).json({ status: "notok", msg: "Veuillez remplir tous les champs." });
    }
  
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ status: "notokmail", msg: "Nom d'utilisateur déjà utilisé" });
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        const newUser = new User({
            username,
            password: hashedPassword
        });
  
        const savedUser = await newUser.save();
  
        const token = jwt.sign(
            { id: savedUser._id },
            config.get("jwtSecret"),
            { expiresIn: config.get("tokenExpire") }
        );
  
        res.status(200).json({ status: "ok", msg: "Inscription réussie", token });
    } catch (err) {
        console.error("Error during registration:", err);  // Log the full error here
        res.status(500).json({ status: "error", msg: "Erreur serveur", error: err.message });
    }
});

  



    // @route POST api/users/login
    // @desc Login user
    // @access Public
    router.post("/login", async (req, res) => {
        console.log("Request body:", req.body); 
        const {username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Please provide username and password" });
        }
    
        try {
            const user = await User.findOne({ username });
            
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch);  // Logs true or false
    
            if (!isMatch) {
                return res.status(401).json({ error: "Incorrect password" });
            }
    
            const token = jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: config.get("tokenExpire") }
            );
            console.log("Generated token:", token);  // Log token for debugging
            
            res.status(200).json({ user ,token});
    
        } catch (err) {
            console.error("Error during login:", err);  // Log the error
            res.status(500).json({ error: "Internal server error" });
        }        
    });


    // @route GET api/users/all
    // @desc Get all users
    // @access Public (Consider protecting this route)
    router.get("/all", async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving users", error });
        }
    });

    // @route GET api/users/:id
    // @desc Get user by ID
    // @access Public (Consider protecting this route)
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
        const user = await User.findById(id);
        if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
        } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
        }
    });

    // @route PUT api/users/:id/change-password
    // @desc Changer le mot de passe de l'utilisateur
    // @access Privé
    router.put("/:id/change-password", async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.params;
        console.log("it is working !",id, oldPassword, newPassword);

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Les deux mots de passe sont requis" });
        }
    
        try {
            // Récupérer l'utilisateur
            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
    
            // Comparer l'ancien mot de passe avec celui dans la base de données
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "L'ancien mot de passe est incorrect" });
            }
    
            // Hasher le nouveau mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
    
            // Mettre à jour le mot de passe de l'utilisateur
            user.password = hashedPassword;
            await user.save();
    
            res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
        } catch (error) {
            console.error("Erreur lors du changement de mot de passe:", error);
            res.status(500).json({ message: "Erreur serveur", error: error.message });
        }
    });
    



    // Mettre à jour un utilisateur par ID (UPDATE)
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { username,password } = req.body;
        try {
        const updatedUser = await User.findByIdAndUpdate(
        id,
        { username,password},
        { new: true }
        );
        if (!updatedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès',
        updatedUser });
        } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
        }
        });
    // Supprimer un utilisateur par ID (DELETE)
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
        }
    });

module.exports = router;
