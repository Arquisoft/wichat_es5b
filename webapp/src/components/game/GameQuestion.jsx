import { useState, useEffect } from "react";
import './GameQuestion.css';
import GameOver from "./GameOver";

const questions = [
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ben_hur_1959_poster.jpg/1280px-Ben_hur_1959_poster.jpg",
    "options": ["Titanic", "El Señor de los Anillos: El Retorno del Rey", "Ben-Hur", "Lo que el viento se llevó"],
    "correct": 2,
    "hints": [
      "Es una película épica de 1959.",
      "Tiene 11 premios Óscar.",
      "Trata sobre un esclavo convertido en gladiador.",
      "Protagonizada por Charlton Heston."
    ]
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    "options": ["Jurassic Park", "Harry Potter y la Piedra Filosofal", "El Señor de los Anillos: La Comunidad del Anillo", "Gladiador"],
    "correct": 2,
    "hints": [
      "Es una película basada en una novela de fantasía.",
      "Fue dirigida por Peter Jackson.",
      "Es la primera de una trilogía.",
      "Tiene a Frodo como protagonista."
    ]
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2021/11/11/detalle-del-poster-de-harry-potter-y-la-piedra-filosofal.jpeg",
    "options": ["El Hobbit", "Harry Potter y la Piedra Filosofal", "Las Crónicas de Narnia", "Animales Fantásticos"],
    "correct": 1,
    "hints": [
      "Se basa en los libros de J.K. Rowling.",
      "El protagonista es un joven mago.",
      "Tiene un sombrero seleccionador.",
      "Fue estrenada en 2001."
    ]
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
    "options": ["El Rey León", "Shrek", "Mulán", "Frozen"],
    "correct": 1,
    "hints": [
      "Es una película de DreamWorks.",
      "El protagonista es un ogro verde.",
      "Incluye a un burro parlante.",
      "Ganó el primer Óscar a Mejor Película Animada."
    ]
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    "options": ["Interstellar", "Wall-E", "Star Wars", "Blade Runner 2049"],
    "correct": 1,
    "hints": [
      "Es una película de animación de Pixar.",
      "El protagonista es un robot de limpieza.",
      "Se enamora de otro robot llamado EVA.",
      "Se desarrolla en un futuro postapocalíptico."
    ]
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://media.vandalsports.com/i/640x360/2-2025/2025219102618_1.jpg",
    "options": ["Piratas del Caribe", "Los Goonies", "Peter Pan", "El Capitán Garfio"],
    "correct": 0,
    "hints": [
      "Es una película de aventuras con piratas.",
      "Su protagonista es interpretado por Johnny Depp.",
      "Incluye un barco llamado 'La Perla Negra'.",
      "El personaje principal es el Capitán Jack Sparrow."
    ]
  }
];

export default function MovieQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState([false, false, false, false]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      nextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  });

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (index === questions[currentQuestion].correct) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setTimeout(nextQuestion, 1000);
    } else {
      setGameFinished(true);
    }
  };

  if (gameFinished) {
    return <GameOver correct={correctAnswers} wrong={wrongAnswers} restart={() => {
      setCurrentQuestion(0);
      setCorrectAnswers(0);
      setWrongAnswers(0);
      setGameFinished(false);
      setShowHint([false, false, false, false]);
      setSelectedOption(null);
      setTimeLeft(60);
    }} />;
  }

  const revealHint = (index) => {
    const newHints = [...showHint];
    newHints[index] = true;
    setShowHint(newHints);
  };

  const nextQuestion = () => {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setTimeLeft(60);
      setShowHint([false, false, false, false]);
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-bold">{questions[currentQuestion].question}</h2>
      <img src={questions[currentQuestion].image} alt="Pregunta" className="w-full h-48 object-cover my-3 rounded" />
      <div className="grid grid-cols-2 gap-2">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            className={`py-2 px-4 rounded font-semibold border transition-all duration-200 ${
              selectedOption !== null
                ? index === questions[currentQuestion].correct
                  ? "bg-green-500 text-white"
                  : index === selectedOption
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
                : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="mt-4 text-lg font-semibold">Tiempo restante: {timeLeft} s</p>
      <p className="mt-2 text-lg font-semibold">Pregunta {currentQuestion + 1} de {questions.length}</p>
      <p className="mt-2 text-lg font-semibold">Aciertos: {correctAnswers}</p>
      <div className="mt-3 flex justify-center gap-2">
        {questions[currentQuestion].hints.map((hint, index) => (
          <button
            key={index}
            onClick={() => revealHint(index)}
            className="bg-yellow-400 text-white px-3 py-1 rounded shadow hover:bg-yellow-500"
            disabled={showHint[index]}
          >
            Pista {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-2 text-gray-600">
        {showHint.map((hintRevealed, index) =>
          hintRevealed ? <p key={index}>{questions[currentQuestion].hints[index]}</p> : null
        )}
      </div>
    </div>
  );
}
