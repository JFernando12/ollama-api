import express from 'express';
import { ollamaRouter } from './routes/ollama.route';

const app = express();

app.use(express.json());
app.use(ollamaRouter);

export { app };