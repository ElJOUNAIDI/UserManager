import bcrypt from "bcrypt";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "user_log",
  password: "userpassword",
  database: "projet_log_db"
});

async function createAdmin() {
  // Vérifier si l'admin existe déjà
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    ["admin@example.com"],
    async (err, results) => {
      if (err) {
        console.error("Erreur lors de la vérification :", err);
        connection.end();
        return;
      }

      if (results.length > 0) {
        console.log("Admin existe déjà !");
        connection.end();
        return;
      }

      
      const hashedPassword = await bcrypt.hash("admin123", 10); 
      const sql = "INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)";
      connection.query(
        sql,
        ["Admin", "User", "admin@example.com", hashedPassword, "admin"],
        (err, result) => {
          if (err) {
            console.error("Erreur insertion :", err);
          } else {
            console.log("Admin créé avec succès !");
          }
          connection.end();
        }
      );
    }
  );
}

// Lancer la création de l’admin
createAdmin();
