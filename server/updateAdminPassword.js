import bcrypt from "bcrypt";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "user_log",
  password: "userpassword",
  database: "projet_log_db"
});

async function updateAdminPassword() {
  const hashedPassword = await bcrypt.hash("admin123", 10); // ton mot de passe admin

  connection.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, "admin@example.com"],
    (err, results) => {
      if (err) {
        console.error("Erreur mise à jour :", err);
      } else {
        console.log("Mot de passe admin mis à jour !");
      }
      connection.end();
    }
  );
}

updateAdminPassword();
