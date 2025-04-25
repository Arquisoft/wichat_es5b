import { useState, useEffect, useContext } from "react";
import './GameQuestion.css';
import GameOver from "./GameOver";
import HintsButtons from '../HintsButtons';
import Chatbot from '../Chatbot';
import LoadingScreen from '../LoadingScreen';
import axios from 'axios';
import ProgressBar from '../ProgressBar';
import GameBoard from "./GameBoard";
import { LanguageContext } from "../../LanguageContext";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function MovieQuiz({username, nQuestions, modoJuego}) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [maxTime, setMaxTime] = useState((modoJuego === "normal" ? 60 : 120));
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const PREGUNTASNUM = {nQuestions}.nQuestions;
  const user = {username}.username
  const { translations, currentLang } = useContext(LanguageContext);
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
    const options =
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        text: question.question,
        image: question.imageUrl,
        options: question.options,
        correctOption: question.correctAnswer
      }
    ]);
    console.log(questions)
    setSelectedOption(null);
    if(modoJuego === "normal"){
      setTimeLeft(60);
    }
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
      handleOptionClick();
      return;
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
      if(res.isOver){
        setGameFinished(true);
      }
    } else {
      console.error("Error: respuesta inesperada del servidor", res);
    }

    setTimeout(() => {
      if (res.isOver) {
        setGameFinished(true);
      } else {
        nextQuestion();
      }
    }, 500);
  };

  if (gameFinished) {
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
      return response.data;
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
      return { result: false };
    }
  }

  function formatTime(seconds) {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0
          ? `${minutes} min ${remainingSeconds} s`
          : `${minutes} min`;
    }
    return `${seconds} s`;
  }

  return (
      <div className="object-cover">
        {loading ? (<LoadingScreen/>) :
            (<div className="grid grid-rows-3 gap-2 mx-auto p-10 text-center" >
                  <div className="grid grid-rows-2 bg-orange shadow-lg rounded-lg my-3 py-2">
                    <div className="grid grid-cols-2 ">
                      <p className="mt-2 text-2xl font-semibold align-left justify-top ml-1 text-white">{translations.game_question_1 || "Pregunta"} {questionsAnswered + 1} {translations.game_question_2 || "of"} {PREGUNTASNUM}</p>
                      <div className="grid grid-rows-3 align-right justify-bottom mr-2">
                        <p className="text-lg font-semibold">{translations.game_score || "Puntuación: "} {score}</p>
                        <p className="text-lg font-semibold">{translations.game_time || "Tiempo restante: "} {formatTime(timeLeft)}</p>
                      </div>
                    </div>
                    <ProgressBar timeLeft={timeLeft} maxTime={maxTime}/>
                  </div>
                    <GameBoard handleOptionClick={handleOptionClick} selectedOption={selectedOption} currentQuestion={currentQuestion} optionsDisabled={optionsDisabled} currentLang={currentLang}/>
                  <HintsButtons
                      key={currentQuestion}
                      questionsLlm={currentQuestion.questionsLlm?.[currentLang] ?? []}
                      setScore={setScore}
                  />

                  <Chatbot 
                    movieName={currentQuestion.correctAnswer} 
                    imageUrl={currentQuestion.imageUrl}
                    setScore={setScore} 
                  />
                  
                </div>
            )}

      </div>
  );
}