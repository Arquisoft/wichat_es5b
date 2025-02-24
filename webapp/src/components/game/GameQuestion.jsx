import { useState, useEffect } from "react";
import './GameQuestion.css';

const questions = [
  {
    question: "¿Cuál es la capital de Francia?",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
    options: ["Madrid", "París", "Berlín", "Roma"],
    correct: 1,
    hints: [
      "Es conocida como la Ciudad de la Luz.",
      "Aquí se encuentra la Torre Eiffel.",
      "Su río principal es el Sena."
    ]
  }
];

export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState([false, false, false]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const revealHint = (index) => {
    const newHints = [...showHint];
    newHints[index] = true;
    setShowHint(newHints);
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-bold">{questions[currentQuestion].question}</h2>
      <img
        src={questions[currentQuestion].image}
        alt="Pregunta"
        className="w-full h-48 object-cover my-3 rounded"
      />
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
