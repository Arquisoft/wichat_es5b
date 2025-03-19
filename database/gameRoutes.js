/*

Archivo para implementar las rutas de la API de la bbdd

*/

const express = require('express');
const router = express.Router();
const { Ranking, GameHistory } = require('./gameModels');

// Ruta para obtener el ranking
router.get('/ranking', async (req, res) => {
    try {
      const ranking = await Ranking.find().sort({ correctAnswers: -1 });
      res.json(ranking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Ruta para agregar una nueva entrada al ranking
router.post('/ranking', async (req, res) => {
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

// Ruta para obtener el historial de partidas
router.get('/history', async (req, res) => {
    try {
      const history = await GameHistory.find().sort({ date: -1 });
      res.json(history);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Ruta para agregar una nueva entrada al historial de partidas
router.post('/history', async (req, res) => {
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

module.exports = router;