import { Request, Response } from 'express';
import { ollamaService } from '../services/ollama.service';

const comparePhrases = async (req: Request, res: Response) => {
  try {
    const { frase1, frase2 } = req.body;
    if (!frase1 || !frase2) {
      res.status(400).json({ message: 'frase1 y frase2 son requeridas' });
      return;
    }
    const response = await ollamaService.comparePhrases({ frase1, frase2 });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const ollamaController = {
  comparePhrases
};