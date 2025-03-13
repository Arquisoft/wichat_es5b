import { useState, useEffect } from "react";
import './GameQuestion.css';
import GameOver from "./GameOver";
import HintsButtons from '../HintsButtons';
import axios from 'axios';

const gameUrl = process.env.GAMECONTROLLER_URL || 'http://localhost:8005';

export default function MovieQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const PREGUNTASNUM = 6;


  const nextQuestion = async () => {
    
    setLoading(true);
    const question = await getQuestion();

    setCurrentQuestion(question);
    setSelectedOption(null);
    setTimeLeft(30);
    setLoading(false);
    
  };

  useEffect(() => {
    
    if (timeLeft === 0) {
      setWrongAnswers(wrongAnswers + 1);
      nextQuestion();
    }
    const timer = setInterval(() => {
      if (!gameFinished) {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      } 
    }, 1000);
    return () => clearInterval(timer);
  });

  const handleOptionClick = async (selectedAnswer) => {
    setSelectedOption(selectedAnswer);
    
    
    const res = await answer(selectedAnswer);
    setQuestionsAnswered(questionsAnswered + 1);
    console.log(res.data.result);
    if(res.data.result)
      setCorrectAnswers(correctAnswers + 1);
    else
      setWrongAnswers(wrongAnswers + 1);

    setTimeout(() => {
      if(questionsAnswered>=PREGUNTASNUM-1)
        setGameFinished(true);
      else
        nextQuestion();
    }, 500);
    
  };

  if (gameFinished) {
    endGame();
    return <GameOver correct={correctAnswers} wrong={wrongAnswers} />
  }

  async function start(){
    return (await fetch(gameUrl+"start"))
  }

  async function getQuestion() {
    try {
      const response = await fetch(gameUrl + "/question");
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      return {}; // Objeto vacío
    }
  } 

  async function answer(selectedAnswer) {
    console.log(selectedAnswer)
    return await axios.post(gameUrl +"/answer", {answer: selectedAnswer});;
  } 

  async function endGame() {
    return await axios.get(gameUrl + "/end")
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
      <p className="mt-2 text-lg font-semibold">Pregunta {questionsAnswered + 1} de {PREGUNTASNUM}</p>
      <p className="mt-2 text-lg font-semibold">Aciertos: {correctAnswers}</p>
      
      <HintsButtons key={currentQuestion} movieName={currentQuestion.correctAnswer} />
      
      </div>
      )}

      
      
      
    </div>
  );
}