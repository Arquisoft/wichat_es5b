/*

Archivo para implementar las rutas de la API de la bbdd

*/

const express = require('express');
const router = express.Router();
const { Ranking, GameHistory } = require('./gameModels');
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/my-mongo', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })

const app = express();
app.use(cors());

app.use(express.json());

const port=8006

// Ruta para obtener el ranking
app.get('/ranking', async (req, res) => {
    try {
      const ranking = await Ranking.find().sort({ correctAnswers: -1 });
      res.json(ranking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Ruta para agregar una nueva entrada al ranking
app.post('/newRanking', async (req, res) => {
    const { username, correctAnswers, wrongAnswers } = req.body;

    // Conversión a número
    const correct = Number(correctAnswers);
    const wrong = Number(wrongAnswers);

    // Validaciones
    if (
        correct < 0 || correct > 6 ||      // correctAnswers debe estar entre 0 y 6
        wrong < 0 || wrong > 6 ||          // wrongAnswers debe estar entre 0 y 6
        correct + wrong !== 6              // La suma debe ser 6
    ) {
        return res.status(400).json({ message: "Datos inválidos: correctAnswers y wrongAnswers deben sumar 6 y estar entre 0 y 6." });
    }
    const rankingEntry = new Ranking({
      username: req.body.username,
      correctAnswers: req.body.correctAnswers,
      wrongAnswers: req.body.wrongAnswers
    });

    try {
        const newRankingEntry = await rankingEntry.save();
        res.status(201).json(newRankingEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ruta para actualizar el ranking de un usuario
app.put('/updateRanking/:username', async (req, res) => {
  const { correctAnswers, wrongAnswers } = req.body;
  const username = req.params.username;

  // Conversión a número
  const correct = Number(correctAnswers);
  const wrong = Number(wrongAnswers);

  // Validaciones
  if (
      correct < 0 || correct > 6 ||      // correctAnswers debe estar entre 0 y 6
      wrong < 0 || wrong > 6 ||          // wrongAnswers debe estar entre 0 y 6
      correct + wrong !== 6              // La suma debe ser 6
  ) {
      return res.status(400).json({ message: "Datos inválidos: correctAnswers y wrongAnswers deben sumar 6 y estar entre 0 y 6." });
  }

  try {
      // Buscar usuario en el ranking
      const rankingEntry = await Ranking.findOne({ username });

      if (!rankingEntry) {
          return res.status(404).json({ message: "Usuario no encontrado en el ranking." });
      }

      // Actualizar valores sumando los nuevos valores
      rankingEntry.correctAnswers += correct;
      rankingEntry.wrongAnswers += wrong;

      await rankingEntry.save();

      res.status(200).json({ message: "Ranking actualizado correctamente.", ranking: rankingEntry });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// Ruta para obtener el historial de partidas
app.post('/history', async (req, res) => {
    try {
      const history = await GameHistory.find().sort({ date: -1 });
      res.json(history);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Ruta para agregar una nueva entrada al historial de partidas
app.post('/newHistory', async (req, res) => {
  const { username, date, correctAnswers, wrongAnswers } = req.body;

    // Conversión a número
    const correct = Number(correctAnswers);
    const wrong = Number(wrongAnswers);

    // Validaciones
    if (
      correct < 0 || correct > 6 ||      // CorrectAnswers en el rango [0,6]
      wrong < 0 || wrong > 6 ||          // WrongAnswers en el rango [0,6]
      correct + wrong !== 6              // Suma de respuestas debe ser 6
    ) {
      return res.status(400).json({ message: "Datos inválidos: correctAnswers y wrongAnswers deben sumar 6 y estar entre 0 y 6." });
    }

    // Si pasa las validaciones
    const historyEntry = new GameHistory({
      username: req.body.username,
      date: req.body.date,
      correctAnswers: req.body.correctAnswers,
      wrongAnswers: req.body.wrongAnswers
    });
  
    try {
      const newHistoryEntry = await historyEntry.save();
      res.status(201).json(newHistoryEntry);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

// Ruta para actualizar el historial de un usuario
app.put('/updateHistory/:id', async (req, res) => {
  const { username, correctAnswers, wrongAnswers } = req.body;
  const id = req.params.id;

  // Conversión a número
  const correct = Number(correctAnswers);
  const wrong = Number(wrongAnswers);

  // Validaciones
  if (
      correct < 0 || correct > 6 ||      // correctAnswers debe estar entre 0 y 6
      wrong < 0 || wrong > 6 ||          // wrongAnswers debe estar entre 0 y 6
      correct + wrong !== 6              // La suma debe ser 6
  ) {
      return res.status(400).json({ message: "Datos inválidos: correctAnswers y wrongAnswers deben sumar 6 y estar entre 0 y 6." });
  }

  try {
      // Buscar el historial del usuario y actualizarlo incrementando los valores
      const updatedHistory = await GameHistory.findOneAndUpdate(
          { id },
          { username },
          { $inc: { correctAnswers: correct, wrongAnswers: wrong } },
          { new: true }
      );

      if (!updatedHistory) {
          return res.status(404).json({ message: "Historial no encontrado para este usuario." });
      }

      res.status(200).json(updatedHistory);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

const server = app.listen(port, () => {
  console.log(`DataBase service listening at http://localhost:${port}`);
});

module.exports = server;