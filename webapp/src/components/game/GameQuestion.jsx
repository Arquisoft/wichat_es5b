import { useState, useEffect } from "react";
import './GameQuestion.css';
import GameOver from "./GameOver";
import HintsButtons from '../HintsButtons';
import axios from 'axios';

const questions = [
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ben_hur_1959_poster.jpg/1280px-Ben_hur_1959_poster.jpg",
    "options": ["Titanic", "El Señor de los Anillos: El Retorno del Rey", "Ben-Hur", "Lo que el viento se llevó"],
    "correct": 2,
    
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    "options": ["Jurassic Park", "Harry Potter y la Piedra Filosofal", "El Señor de los Anillos: La Comunidad del Anillo", "Gladiador"],
    "correct": 2,
    
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2021/11/11/detalle-del-poster-de-harry-potter-y-la-piedra-filosofal.jpeg",
    "options": ["El Hobbit", "Harry Potter y la Piedra Filosofal", "Las Crónicas de Narnia", "Animales Fantásticos"],
    "correct": 1,
    
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
    "options": ["El Rey León", "Shrek", "Mulán", "Frozen"],
    "correct": 1,
    
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    "options": ["Interstellar", "Wall-E", "Star Wars", "Blade Runner 2049"],
    "correct": 1,
    
  },
  {
    "question": "¿A qué película pertenece esta escena?",
    "image": "https://media.vandalsports.com/i/640x360/2-2025/2025219102618_1.jpg",
    "options": ["Piratas del Caribe", "Los Goonies", "Peter Pan", "El Capitán Garfio"],
    "correct": 0,
    
  }
];

export default function MovieQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questionsResponded, setQuestionsResponded] = useState(0);
  const [loading, setLoading] = useState(true);


  const nextQuestion = async () => {
    setLoading(true);
      const question = await getQuestion();
      setCurrentQuestion(question);
      setSelectedOption(null);
      setTimeLeft(10);
    setLoading(false);
    
  };

  useEffect(() => {
    
    if (timeLeft === 0) {
      nextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  });

  const handleOptionClick = async (selectedAnswer) => {

    setSelectedOption(selectedAnswer)
    const res = await answer();
    setQuestionsResponded(questionsResponded + 1);
    if(res)
      setCorrectAnswers(correctAnswers + 1)
    else
      setWrongAnswers(wrongAnswers + 1)
    if(questionsResponded>=5)
      setGameFinished(true);
    else
      nextQuestion();
  };

  if (gameFinished) {
    endGame();
    return <GameOver correct={correctAnswers} wrong={wrongAnswers} restart={() => {
    }} />;
  }


  


  async function getQuestion() {
    return (await fetch("http://localhost:8005/question")).json()
  } 

  async function answer() {
    return await axios.post("http://localhost:8005/answer", {answer: selectedOption});
  } 

  async function endGame() {
    return await axios.get("http://localhost:8005/end")
  }

  

  return (
    <div>
      {loading ? (<p>Cargando...</p>) :  (<div className="max-w-xl mx-auto p-10 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
      <img src={currentQuestion.imageUrl} alt="Pregunta" className="w-full h-48 object-cover my-3 rounded" />
      <div className="grid grid-cols-2 gap-2">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`py-2 px-4 rounded font-semibold border transition-all duration-200 ${
              selectedOption !== null
                ? option === currentQuestion.correctAnswer
                  ? "bg-green-500 text-white"
                  : option === selectedOption
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
      <p className="mt-2 text-lg font-semibold">Pregunta {questionsResponded} de {questions.length}</p>
      <p className="mt-2 text-lg font-semibold">Aciertos: {correctAnswers}</p>
      
      <HintsButtons key={currentQuestion} movieName={currentQuestion.correctAnswer} />
      
      </div>
      )}

      
      
      
    </div>
  );
}
