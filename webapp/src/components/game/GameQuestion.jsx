import { useState, useEffect } from "react";
import './GameQuestion.css';
import GameOver from "./GameOver";
import HintsButtons from '../HintsButtons';
import Chatbot from '../Chatbot';
import LoadingScreen from '../LoadingScreen';
import axios from 'axios';
import ProgressBar from '../ProgressBar';
import NormalGame from "./NormalGame";
import BateriaDeSabiosGame from "./BateriaDeSabiosGame";  // Asegúrate de importar la barra de progreso correctamente

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function MovieQuiz({username, nQuestions, modoJuego}) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [optionsDisabled, setOptionsDisabled] = useState(false);//opcion para desactivar los botones de respuesta
  const PREGUNTASNUM = {nQuestions}.nQuestions;
  const user = {username}.username
  const [questions, setQuestions] = useState([]);


  const nextQuestion = async () => {

    console.log("PreguntasNumero: " + PREGUNTASNUM);

    setLoading(true);
    const question = await getQuestion();
    setLoading(false);

    if (!question || Object.keys(question).length === 0) {
      console.error("Error: no se recibió una nueva pregunta.");
      return;
    }

    console.log("Nueva pregunta obtenida:", question);

    setCurrentQuestion(question);
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        text: question.question,
        image: question.imageUrl,
        option1: question.options[0],
        option2: question.options[1],
        option3: question.options[2],
        option4: question.options[3],
        correctOption: question.correctAnswer
      }
    ]);
    console.log(questions)
    setSelectedOption(null);
    setTimeLeft(60);
    setLoading(false);
    setOptionsDisabled(false);
  };

  useEffect(() => {
    nextQuestion();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameFinished) {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameFinished]);

  useEffect(() => {
    if (timeLeft === 0) {
      // setWrongAnswers((prev) => prev + 1);
      // setQuestionsAnswered((prev) => prev + 1);

      handleOptionClick();

      if (questionsAnswered >= PREGUNTASNUM) {
        setGameFinished(true);
      } else {
        nextQuestion();
      }
      return; // Evita seguir con el temporizador
    }
  }, [timeLeft]);


  const handleOptionClick = async (selectedAnswer) => {
    setSelectedOption(selectedAnswer);
    setOptionsDisabled(true);

    const res = await answer(selectedAnswer);
    setQuestionsAnswered((prev) => prev + 1);

    if (res !== undefined) {
      if (res.isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        setScore(res.score)
      }

      else setWrongAnswers((prev) => prev + 1);
    } else {
      console.error("Error: respuesta inesperada del servidor", res);
    }

    setTimeout(() => {
      if (questionsAnswered >= PREGUNTASNUM - 1) {
        setGameFinished(true);
      } else {
        nextQuestion();
      }
    }, 500);
  };

  if (gameFinished) {
    endGame()
    console.log(score)
    return <GameOver correct={correctAnswers} wrong={wrongAnswers} username ={user} questions={questions} score={score} />
  }

  async function getQuestion() {
    try {
      const response = await fetch(apiEndpoint + "/question");
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
    try {
      console.log("Enviando respuesta:", selectedAnswer, "tiempo: "+timeLeft);
      const response = await axios.post(apiEndpoint + "/answer", { answer: selectedAnswer, timeLeft: timeLeft });
      console.log("Respuesta recibida:", response);
      return response.data; // Devolver los datos en lugar del objeto completo
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
      return { result: false }; // Evita `undefined` y devuelve un objeto seguro
    }
  }

  async function endGame() {
    return (await fetch(apiEndpoint + "/end", {
      method: 'POST',
    }))
  }

  return (
      <div className="object-cover">
        {loading ? (<LoadingScreen/>) :
            (<div className="grid grid-rows-3 gap-2 max-w-xl mx-auto p-10 text-center" >
                  <div className="grid grid-rows-2 bg-orange shadow-lg rounded-lg my-3 py-2">
                    <div className="grid grid-cols-2 ">
                      <p className="mt-2 text-2xl font-semibold align-left justify-top ml-1 text-white">Pregunta {questionsAnswered + 1} de {PREGUNTASNUM}</p>
                      <div className="grid grid-rows-3 align-right justify-bottom mr-2">
                        <p className="text-lg font-semibold">Puntuación: {score}</p>
                        <p className="text-lg font-semibold">Tiempo restante: {timeLeft} s</p>
                      </div>
                    </div>
                    <ProgressBar timeLeft={timeLeft}/>
                  </div>
                  {modoJuego=="normal" ?
                    (<NormalGame handleOptionClick={handleOptionClick} selectedOption={selectedOption} currentQuestion={currentQuestion} optionsDisabled={optionsDisabled}/>)
                    :
                    (<BateriaDeSabiosGame handleOptionClick={handleOptionClick} selectedOption={selectedOption} currentQuestion={currentQuestion} optionsDisabled={optionsDisabled}/>)
                  }
                  <HintsButtons key={currentQuestion} questionsLlm={currentQuestion.questionsLlm} setScore={setScore} />
                  <Chatbot movieName={currentQuestion.correctAnswer} setScore={setScore} />
                </div>
            )}

      </div>
  );
}