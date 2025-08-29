import express from "express";
import bcrypt from "bcrypt";
import connection from "../lib/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName);

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
    connection.query(
      sql,
      [firstName, lastName, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erreur serveur." });
        }
        res.json({
          message: "Utilisateur enregistré avec succès.",
          userId: result.insertId,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }
  try {
    const sql = `SELECT * FROM users WHERE email = ?`;
    connection.query(sql, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Mot de passe incorrect." });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Connexion réussie.", token, role: user.role });
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = decoded;
    next();
  });
}
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next();
}

// Liste des utilisateurs (admin seulement)
router.get("/users", authMiddleware, adminMiddleware, (req, res) => {
  const sql = "SELECT id, firstName, lastName, email, role FROM users";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    res.json(results);
  });
});


router.delete("/users/:id", authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res
      .status(403)
      .json({ error: "Vous ne pouvez pas supprimer votre propre compte !" });
  }

  const sql = "DELETE FROM users WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    res.json({ message: "Utilisateur supprimé." });
  });
});

router.get("/home", authMiddleware, (req, res) => {
  res.json({
    message: `Bienvenue, utilisateur ${req.user.email}`,
    role: req.user.role,
  });
});
export default router;
