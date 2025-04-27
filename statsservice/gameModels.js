/* 

Aqui se implementa el modelo de datos que se va a utilziar en la bbdd de la aplicación

Se definen los esquemas para almacenar el ranking global del usuario, y el historial de partidas del usuario

El ranking del usuario almacenará el usuario, el número de preguntas acertadas y falladas

El historia de partidas almacenará el usuario, la fecha de la partida, el número de aciertos, y el número de fallos

*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/game';


mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })

// Esquema para el ranking
const RankingSchema = new Schema({
    username: { type: String, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    totalScore: { type: Number, required: true }
});

// Esquema para el historial
const GameHistorySchema = new Schema({
    username: { type: String, required: true },
    date: { type: Date, default: Date.now },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    totalScore: { type: Number, required: true },

    /*
    Formato de las preguntas:

        [
            {
                text: "¿Capital de Francia?",
                image: "http://url-de-imagen.jpg",
                option1: "Madrid",
                option2: "Roma",
                option3: "París",
                option4: "Berlín",
                correctOption: "París"
            },
            ...
        ]

    */
   
    questions: [
        {
            question: { type: Object, required: true },
            image: { type: String },
            options: { type: Array, required: true },
        /*    option2: { type: String, required: true },
            option3: { type: String, required: true },
            option4: { type: String, required: true },*/
            correctOption: { type: String, required: true }
        }
    ]
});
  
const Ranking = mongoose.model('Ranking', RankingSchema);
const GameHistory = mongoose.model('GameHistory', GameHistorySchema);


module.exports = { Ranking, GameHistory };