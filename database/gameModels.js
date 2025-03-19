/* 

Aqui se implementa el modelo de datos que se va a utilziar en la bbdd de la aplicación

Se definen los esquemas para almacenar el ranking global del usuario, y el historial de partidas del usuario

El ranking del usuario almacenará el usuario, el número de preguntas acertadas y falladas

El historia de partidas almacenará el usuario, la fecha de la partida, el número de aciertos, y el número de fallos

*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema para el ranking
const RankingSchema = new Schema({
    username: { type: String, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true }
});

// Esquema para el historial
const GameHistorySchema = new Schema({
    username: { type: String, required: true },
    date: { type: Date, default: Date.now },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true }
});
  
const Ranking = mongoose.model('Ranking', RankingSchema);
const GameHistory = mongoose.model('GameHistory', GameHistorySchema);

module.exports = { Ranking, GameHistory };