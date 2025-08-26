import express from 'express';
// import {connection}  from '../lib/db';    
const router = express.Router();

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName)

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    res.json({ message: "Utilisateur enregistre avec success." });
});

export default router;
