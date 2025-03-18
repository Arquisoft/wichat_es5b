import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import GameQuestion from './GameQuestion';

//creamos el mock adapter para axios
const mockAxios = new MockAdapter(axios);

//mockeamos el componente HintsButtons
jest.mock('../HintsButtons', () => {
  return function MockHintsButtons() {
    return (
      <div data-testid="hints-buttons">
        <button>Pista 1</button>
        <button>Pista 2</button>
        <button>Pista 3</button>
        <button>Pista 4</button>
      </div>
    );
  };
});

//mockeamos el componente GameOver
jest.mock('./GameOver', () => {
  return function MockGameOver() {
    return <div data-testid="game-over">Game Over</div>;
  };
});

//mockeamos el fetch global
global.fetch = jest.fn();

const mockQuestionData = {
  question: "¿De qué película es esta imagen?",
  imageUrl: "https://example.com/movie1.jpg",
  options: ["Película 1", "Película 2", "Película 3", "Película 4"],
  correctAnswer: "Película 1"
};

describe('GameQuestion Component', () => {
  beforeEach(() => {
    //reseteamos los mocks 
    mockAxios.reset();
    jest.clearAllMocks();
    
    //configuramos los mocks de axios
    mockAxios.onPost('http://localhost:8005/answer').reply(200, { result: true });
    mockAxios.onGet('http://localhost:8005/end').reply(200);
    
    //configuramos los mocks de fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes('/start')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('OK')
        });
      }
      if (url.includes('/question')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockQuestionData)
        });
      }
      return Promise.reject(new Error(`Unhandled fetch call to ${url}`));
    });
  });

  test('se renderiza correctamente con una pregunta', async () => {
    await act(async () => {
      render(<GameQuestion />);
    });
    
    
    await waitFor(() => {
      expect(screen.queryByText("¿De qué película es esta imagen?")).toBeInTheDocument();
    });
  });

  test('muestra una imagen en la pregunta', async () => {
    await act(async () => {
      render(<GameQuestion />);
    });
    
    await waitFor(() => {
      const image = screen.queryByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/movie1.jpg');
    });
  });

  test('muestra opciones de respuesta', async () => {
    await act(async () => {
      render(<GameQuestion />);
    });
    
    await waitFor(() => {
      expect(screen.queryByText("Película 1")).toBeInTheDocument();
      expect(screen.queryByText("Película 2")).toBeInTheDocument();
      expect(screen.queryByText("Película 3")).toBeInTheDocument();
      expect(screen.queryByText("Película 4")).toBeInTheDocument();
    });
  });

  test('cambia el color del botón al seleccionar una opción', async () => {
    await act(async () => {
      render(<GameQuestion />);
    });
    
    await waitFor(() => {
      expect(screen.queryByText("Película 1")).toBeInTheDocument();
    });
    
    const firstOption = screen.getByText("Película 1");
    
    await act(async () => {
      fireEvent.click(firstOption);
    });
    
    
    await waitFor(() => {
      
      expect(firstOption.className).toContain("bg-green-500");
    });
  });

  test('muestra el tiempo restante', async () => {
    await act(async () => {
      render(<GameQuestion />);
    });
    
    await waitFor(() => {
      expect(screen.queryByText(/Tiempo restante:/)).toBeInTheDocument();
    });
  });

  test('el tiempo restante se actualiza correctamente', async () => {
    jest.useFakeTimers();
    
    await act(async () => {
      render(<GameQuestion />);
    });
    
    await waitFor(() => {
      expect(screen.queryByText(/Tiempo restante:/)).toBeInTheDocument();
    });
    
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(screen.queryByText(/Tiempo restante: 9/)).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('muestra el componente de pistas', async () => {
    await act(async () => {
      render(<GameQuestion />);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('hints-buttons')).toBeInTheDocument();
    });
  });
});