import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); 

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "user_log",
  password: process.env.DB_PASSWORD || "userpassword",
  database: process.env.DB_NAME || "projet_log_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connecté à MySQL (Docker) !");
});

export default connection;
