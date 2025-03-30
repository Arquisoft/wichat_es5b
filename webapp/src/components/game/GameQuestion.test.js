import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MovieQuiz from './GameQuestion';
import axios from 'axios';
import { executeSparqlQuery } from '../../../../wikidataservice/wikidata-service';

//mockeo dependencias externas
jest.mock('axios');
global.fetch = jest.fn();
jest.mock('../../../../wikidataservice/wikidata-service', () => ({
  executeSparqlQuery: jest.fn()
}));

//mockeo componentes hijos
jest.mock('../LoadingScreen', () => () => <div data-testid="mock-loading">Loading Mockeado</div>);
jest.mock('../HintsButtons', () => ({ movieName }) => (
  <div data-testid="hints-buttons">
    <span data-testid="movie-name">{movieName}</span>
    <button>Pista</button>
  </div>
));
jest.mock('./GameOver', () => ({ correct, wrong }) => (
  <div data-testid="game-over">
    <span>Aciertos: {correct}</span>
    <span>Fallos: {wrong}</span>
  </div>
));


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

describe('GameQuestion Component', () => {
  const mockQuestion = {
    question: "¿Cuál es la película?",
    imageUrl: "https://example.com/image.jpg",
    options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
    correctAnswer: "Opción 2"
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
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('se renderiza correctamente con una pregunta', async () => {
    render(<MovieQuiz />);
    
    //checkeamos la pregunta 
    expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
  });

  test('muestra una imagen en la pregunta', async () => {
    render(<MovieQuiz />);
    
    const img = screen.getByAltText("Pregunta");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockQuestion.imageUrl);
  });

  /*
  test('muestra opciones de respuesta', async () => {
    render(<MovieQuiz />);
    
    mockQuestion.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    }); 
  }); */

  test('muestra opciones de respuesta', async () => {
    render(<MovieQuiz />);
    
    mockQuestion.options.forEach(option => {
      
      const buttons = screen.getAllByRole('button', { name: option });
      expect(buttons.length).toBeGreaterThan(0);
      
    });
  });

  test('cambia el color del botón al seleccionar una opción', async () => {
    render(<MovieQuiz />);
    
    //encuentra pirmer boton de pregunta
    const firstOptionButton = screen.getByText(mockQuestion.options[0]);
    expect(firstOptionButton).toHaveClass("bg-blue-500");
    
    //ha click
    fireEvent.click(firstOptionButton);
    
    //veerifica que axios.post se ha llmaado
    expect(axios.post).toHaveBeenCalledWith(
      `${apiEndpoint}/answer`,
      { answer: mockQuestion.options[0] }
    );
  });

  test('muestra el tiempo restante', async () => {
    render(<MovieQuiz />);
    
    expect(screen.getByText("Tiempo restante: 10 s")).toBeInTheDocument();
  });

  test('el tiempo restante se actualiza correctamente', async () => {
    render(<MovieQuiz />);
    
    //check t0
    expect(screen.getByText("Tiempo restante: 10 s")).toBeInTheDocument();
    
    //avanzo tiempo
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    
  });

  test('muestra el componente de pistas', async () => {
    render(<MovieQuiz />);
    
    //checkeat componente de pistas
    const hintsComponent = screen.getByTestId('hints-buttons');
    expect(hintsComponent).toBeInTheDocument();
    
    //checkear nombre de la pelicula
    const movieNameElement = screen.getByTestId('movie-name');
    expect(movieNameElement).toHaveTextContent(mockQuestion.correctAnswer);
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
    
    render(<MovieQuiz />);
    
    //chekeacmos GameOver component
    expect(screen.getByTestId('game-over')).toBeInTheDocument();
  });
});