/*

Archivo para implementar las rutas de la API de la bbdd

*/

const express = require('express');
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
app.get('/history', async (req, res) => {
    try {
      const history = await GameHistory.find().sort({ date: -1 });
      res.json(history);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Ruta para agregar una nueva entrada al historial de partidas
app.post('/newHistory', async (req, res) => {
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

const server = app.listen(port, () => {
  console.log(`DataBase service listening at http://localhost:${port}`);
});

module.exports = server;