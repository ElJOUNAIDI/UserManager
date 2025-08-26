import express from 'express';
import bcrypt from 'bcrypt';
import connection from '../lib/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName)

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }
    try {
        // hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // requête SQL
        const sql = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
        connection.query(sql, [firstName, lastName, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erreur serveur." });
            }
            res.json({ message: "Utilisateur enregistré avec succès.", userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'inscription." });
    }
});

export default router;

// Login

