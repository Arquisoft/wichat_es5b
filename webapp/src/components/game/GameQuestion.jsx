import { useState, useEffect } from "react";
import './GameQuestion.css';
import GameOver from "./GameOver";
import HintsButtons from '../HintsButtons';
import axios from 'axios';

const gameUrl = process.env.GAMECONTROLLER_URL || 'http://localhost:8005';

export default function MovieQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const PREGUNTASNUM = 6;

  // Inicializar el juego cuando se carga el componente
  useEffect(() => {
    const initGame = async () => {
      try {
        await start();
        const question = await getQuestion();
        
        if (question && Object.keys(question).length > 0) {
          setCurrentQuestion(question);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al inicializar el juego:", error);
        setLoading(false);
      }
    };
    
    initGame();
  }, []);

  // Timer para la cuenta atrás
  useEffect(() => {
    if (!currentQuestion || gameFinished) return;
    
    if (timeLeft === 0) {
      handleTimeOver();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, gameFinished, currentQuestion]);

  const handleTimeOver = async () => {
    setWrongAnswers((prev) => prev + 1);
    setQuestionsAnswered((prev) => prev + 1);
    
    if (questionsAnswered >= PREGUNTASNUM - 1) {
      setGameFinished(true);
    } else {
      await nextQuestion();
    }
  };

  const nextQuestion = async () => {
    setLoading(true);
    try {
      const question = await getQuestion();
      
      if (!question || Object.keys(question).length === 0) {
        console.error("Error: no se recibió una nueva pregunta.");
        setLoading(false);
        return;
      }
      
      setCurrentQuestion(question);
      setSelectedOption(null);
      setTimeLeft(10);
    } catch (error) {
      console.error("Error al obtener la siguiente pregunta:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (selectedAnswer) => {
    setSelectedOption(selectedAnswer);
    
    try {
      const res = await answer(selectedAnswer);
      setQuestionsAnswered((prev) => prev + 1);
      
      if (res && res.result !== undefined) {
        if (res.result) {
          setCorrectAnswers((prev) => prev + 1);
        } else {
          setWrongAnswers((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
    
    // Después de responder, pasar a la siguiente pregunta o finalizar
    setTimeout(async () => {
      if (questionsAnswered >= PREGUNTASNUM - 1) {
        setGameFinished(true);
      } else {
        await nextQuestion();
      }
    }, 500);
  };

  async function start() {
    try {
      const response = await fetch(`${gameUrl}/start`);
      if (!response.ok) {
        throw new Error(`Error al iniciar el juego: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error al iniciar el juego:", error);
      throw error;
    }
  }

  async function getQuestion() {
    try {
      const response = await fetch(`${gameUrl}/question`);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      return null;
    }
  }

  async function answer(selectedAnswer) {
    try {
      const response = await axios.post(`${gameUrl}/answer`, { answer: selectedAnswer });
      return response.data;
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
      return { result: false };
    }
  }

  async function endGame() {
    try {
      return await axios.get(`${gameUrl}/end`);
    } catch (error) {
      console.error("Error al finalizar el juego:", error);
    }
  }

  if (gameFinished) {
    endGame();
    return <GameOver correct={correctAnswers} wrong={wrongAnswers} />;
  }

  return (
    <div>
      {loading || !currentQuestion ? (
        <p data-testid="loading">Cargando...</p>
      ) : (
        <div className="max-w-xl mx-auto p-10 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
          <img src={currentQuestion.imageUrl} alt="Pregunta" className="w-full h-48 object-cover my-3 rounded" />
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options && currentQuestion.options.map((option, index) => (
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
          
          <HintsButtons key={currentQuestion.correctAnswer || "default"} movieName={currentQuestion.correctAnswer} />
        </div>
      )}
    </div>
  );
}