import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
