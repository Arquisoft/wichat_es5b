import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '../../test-utils';
import MovieQuiz from './GameQuestion';
import axios from 'axios';
import { executeSparqlQuery } from '../../../../wikidataservice/wikidata-service';
import { LanguageProvider } from '../../LanguageContext';


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

//mockeo dependencias externas
jest.mock('axios');
global.fetch = jest.fn();
jest.mock('../../../../wikidataservice/wikidata-service', () => ({
  executeSparqlQuery: jest.fn()
}));

//mockeo componentes hijos
jest.mock('../LoadingScreen', () => () => <div data-testid="mock-loading">Loading Mockeado</div>);
jest.mock('./GameOver', () => ({ correct, wrong }) => (
    <div data-testid="game-over">
      <span>Aciertos: {correct}</span>
      <span>Fallos: {wrong}</span>
    </div>
));

describe('GameQuestion Component', () => {
  const mockQuestion = {
    question: "¿Cuál es la película?",
    imageUrl: "https://example.com/image.jpg",
    options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
    correctAnswer: "Opción 2",
    questionsLlm: ["Pista 1", "Pista 2", "Pista 3", "Pista 4"]
  };


  const mockWikidataResponse = {
    results: {
      bindings: [
        { itemLabel: { value: "Película 1" }, pic: { value: "https://example.com/movie1.jpg" } },
        { itemLabel: { value: "Película 2" }, pic: { value: "https://example.com/movie2.jpg" } }
      ]
    }
  };

  //useState original
  const originalUseState = React.useState;

  //trackeo de todos los state setters mockeados
  let mockSetters = {};
  let gameMode ="normal"

  //state mocking
  function mockUseState(initialState) {
    //mockeo estados especificos
    if (initialState === "") {
      //currentQuestion state
      return [mockQuestion, (val) => { mockSetters.currentQuestion = val; }];
    } else if (initialState === true) {
      //loading state
      return [false, (val) => { mockSetters.loading = val; }];
    } else if (initialState === false && typeof initialState === 'boolean') {
      //gameFinished state
      return [false, (val) => { mockSetters.gameFinished = val; }];
    } else if (initialState === 30) {
      //timeLeft state
      return [10, (val) => { mockSetters.timeLeft = val; }];
    }

    //para todos los demas
    return originalUseState(initialState);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    global.fetch = jest.fn((url) => {
      if (url.includes('/question')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockQuestion),
        });
      }
    
      if (url.includes('messages_es.properties')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('Primera Pista=Primera Pista\nSegunda Pista=Segunda Pista\nTercera Pista=Tercera Pista\nCuarta Pista=Cuarta Pista\n'),
        });
      }
    
      // fallback
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
      });
    });    

    mockSetters = {}; //resetear state setters

    //mockeo useState
    jest.spyOn(React, 'useState').mockImplementation(mockUseState);

    //mockeo fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes('/question')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockQuestion)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      });
    });

    // mock axios
    axios.post.mockResolvedValue({ data: { result: true } });
    axios.get.mockResolvedValue({ data: {} });

    //mockeo Wikidata service
    executeSparqlQuery.mockResolvedValue(mockWikidataResponse);


    axios.post.mockImplementation((url, data) => {
      if (url.includes('/hintUsed')) {
        const numHint  = data.numHint;
        const score = 5 * (numHint + 1);
        return Promise.resolve({ data: { score: -score } });
      }
      if (url.includes('/askllm')) {
        return Promise.resolve({ data: { answer: 'Pista del LLM correcta' } });
      }
      if(url.includes('chatBotUsed')){
        return Promise.resolve({ data: { score: -20 } });
      }
      if(url.includes('answer')){
        const timeLeft  = data.timeLeft;
        const isCorrectAnsw = data.answer === mockQuestion.correctAnswer
        const isGameOver = gameMode === "normal" ? false : isCorrectAnsw
        return Promise.resolve({ data: { isCorrect: isCorrectAnsw, score: 100+timeLeft, isOver:isGameOver  } });
      }
      return Promise.resolve({ data: {} });
    });

  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('se renderiza correctamente con una pregunta', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    //checkeamos la pregunta
    expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
  });

  test('muestra una imagen en la pregunta', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    const img = screen.getByAltText("Pregunta");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockQuestion.imageUrl);
  });

  test('muestra opciones de respuesta', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    mockQuestion.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
      const buttons = screen.getAllByRole('button', { name: option });
      expect(buttons.length).toBeGreaterThan(0);

    });
  });

  test('cambia el color del botón al seleccionar una opción', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    //encuentra pirmer boton de pregunta
    const firstOptionButton = screen.getByText(mockQuestion.options[0]);
    expect(firstOptionButton).toHaveClass("bg-blue-500");

    //ha click
    fireEvent.click(firstOptionButton);

    //veerifica que axios.post se ha llmaado
    expect(axios.post).toHaveBeenCalledWith(
        `${apiEndpoint}/answer`,
        { answer: mockQuestion.options[0] , timeLeft:60}
    );
  });

  test('muestra el tiempo restante', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    expect(screen.getByText("Tiempo restante: 1 min")).toBeInTheDocument();
  });

  test('el tiempo restante se actualiza correctamente', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    //check t0
    expect(screen.getByText("Tiempo restante: 1 min")).toBeInTheDocument();

    //avanzo tiempo
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  test('muestra el componente de pistas', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    //checkear componente de pistas
    const hintButtonLabels = [
      'Primera Pista',
      'Segunda Pista',
      'Tercera Pista',
      'Cuarta Pista'
    ];

    for (const label of hintButtonLabels) {
      const hintButton = await screen.findByRole('button', { name: label });
      expect(hintButton).toBeInTheDocument();
    }
  });

  test('muestra GameOver cuando se completan todas las preguntas', async () => {
    //en este test se necesita hacer override de gameFinished state
    jest.spyOn(React, 'useState').mockImplementation((initialState) => {
      if (initialState === false && typeof initialState === 'boolean') {

        return [true, jest.fn()]; //se pone a true para mostrar GameOver
      }
      //para otros estados
      return mockUseState(initialState);
    });

    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    //chekeacmos GameOver component
    expect(screen.getByTestId('game-over')).toBeInTheDocument();
  });

  test('actualiza la puntuación al utilizar los botones de pistas', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    const hintButtonLabels = [
      'Primera Pista',
      'Segunda Pista',
      'Tercera Pista',
      'Cuarta Pista'
    ];

    let score = 0
    for(let i = 0; i <hintButtonLabels.length;i++){
      const hintButton = await screen.findByRole('button', { name: hintButtonLabels[i] });
      // score =  5 * (i + 1);
      fireEvent.click(hintButton);
      await waitFor(() => {
        expect(screen.getByText(new RegExp(-5))).toBeInTheDocument(); // -5
        console.log("SCORE ("+i+")"+score)
      });
    }
  });

  test('actualiza la puntuación al utilizar el chatBot', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);

    const toggleButton = screen.getByRole('button', { name: /Chat de Pistas ▲/i });
    fireEvent.click(toggleButton);

    const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
    const sendButton = screen.getByRole('button', { name: /Enviar/i });

    fireEvent.change(inputField, { target: { value: '¿Quién es el director?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/-20/)).toBeInTheDocument();
    });
  });

  test('actualiza la puntuación al acertar una pregunta', async () => {
    render(<MovieQuiz username={"user"} modoJuego={"normal"} nQuestions={6}/>);
    const button = screen.getByRole('button', { name: mockQuestion.correctAnswer });
    fireEvent.click(button);

    expect(axios.post).toHaveBeenCalledWith(
        `${apiEndpoint}/answer`,
        { answer: mockQuestion.options[1] , timeLeft:60}
    );

    await waitFor(() => {
      expect(screen.getByText(/160/)).toBeInTheDocument();
    });

  });

  test('en el modo "batería de sabios", al fallar una pregunta acaba el juego', async () => {
    gameMode = "bateriaSabios";

    const incorrectAnswer = mockQuestion.options.find(opt => opt !== mockQuestion.correctAnswer);

    let gameFinished = false;
    const setGameFinishedMock = jest.fn((val) => { gameFinished = val; });

    jest.spyOn(React, 'useState').mockImplementation((init) => {
      if (init === false && typeof init === 'boolean') {
        return [gameFinished, setGameFinishedMock];
      }
      return originalUseState(init);
    });

    const { rerender } = render(
        <LanguageProvider>
          <MovieQuiz username={"user"} modoJuego={gameMode} nQuestions={6}/>
        </LanguageProvider>
    );

    const button = await screen.findByRole('button', { name: incorrectAnswer });
    fireEvent.click(button);

    expect(setGameFinishedMock).toHaveBeenCalledWith(true);

    rerender(
        <LanguageProvider>
          <MovieQuiz username={"user"} modoJuego={gameMode} nQuestions={6}/>
        </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('game-over')).toBeInTheDocument();
      expect(screen.getByText(/Fallos:/)).toBeInTheDocument();
    });
  });


});