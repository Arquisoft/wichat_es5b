import './GameQuestion.css';

export default function NormalGame({handleOptionClick, selectedOption, currentQuestion, optionsDisabled, currentLang}) {

  return (
        <div className="grid grid-cols-2 gap-2">
          <div class>
            <img src={currentQuestion.imageUrl} alt="Pregunta" className="w-full h-48 my-3 rounded" />
          </div>
          <div className = "bg-orange shadow-lg rounded-lg py-2">
              <h2 className="text-2xl font-bold text-white mx-4">
                  {typeof currentQuestion.question === 'object' ? currentQuestion.question[currentLang] : currentQuestion.question}
              </h2>
              <div className="grid grid-cols-1 gap-2">
              {currentQuestion.options.map((option, index) => (
                  <button
                      id={`option-${index}`}
                      key={index}
                      onClick={() => !optionsDisabled && handleOptionClick(option)}
                      className={`py-2 px-4 mx-4 rounded font-semibold border transition-all duration-200 
                        ${selectedOption !== null
                              ? option === currentQuestion.correctAnswer
                                  ? "bg-green-500 text-black"
                                  : option === selectedOption
                                      ? "bg-red-500 text-black"
                                      : "bg-gray-200"
                              : "bg-blue-500 text-black hover:bg-blue-700"}
                        ${optionsDisabled ? "pointer-events-none" : ""}
                      `}
                  >
                    {option}
                  </button>
              ))}
            </div>
          </div>
        </div>
  );
}