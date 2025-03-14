export default function GameOver({ correct, wrong, restart }) {
    return (
      <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold">Fin de la partida</h2>
        <p className="mt-4 text-lg font-semibold">Respuestas correctas: {correct}</p>
        <p className="mt-2 text-lg font-semibold">Respuestas incorrectas: {wrong}</p>
        
      </div>
    );
  }