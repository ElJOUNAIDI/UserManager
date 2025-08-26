import express from 'express';
import cors from "cors";
const app = express();
import dotenv from "dotenv";

dotenv.config();

app.use(cors());
app.use(express.json());


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
