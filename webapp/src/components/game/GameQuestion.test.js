import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameQuestion from './GameQuestion';

describe('GameQuestion Component', () => {
  
   
  test('se renderiza correctamente con una pregunta', () => {
    render(<GameQuestion />);
    
    //buscamos un encabezado de nivel h2, indica que hay una pregunta en pantalla.
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });


  test('muestra una imagen en la pregunta', () => {
    render(<GameQuestion />);
    
    //verificamos que cada pregunta tenga su imagen correspondiente
    expect(screen.getByRole("img")).toBeInTheDocument();
  });


  test('muestra opciones de respuesta', () => {
    render(<GameQuestion />);
    
    const buttons = screen.getAllByRole("button");
    //expect(buttons.length).toBeGreaterThan(0);
    expect(buttons.length).toBe(8); //4 botones de respuesta y 4 de pistas
  });


  test('cambia el color del botón al seleccionar una opción', async () => {
    render(<GameQuestion />);
    
    //seleccionamos el primer boton de respuesta
    const firstOptionButton = screen.getAllByRole("button")[0];
  
    //clic en la opcion
    fireEvent.click(firstOptionButton);
  
    //esperamos a que cambie de color
    await waitFor(() => {
      expect(firstOptionButton).not.toHaveClass("bg-blue-500");
    });
  });
  

  test('muestra el tiempo restante', () => {
    render(<GameQuestion />);
    
    expect(screen.getByText(/^Tiempo restante:/)).toBeInTheDocument();
  });


  test('se muestra el componente de pistas una sola vez', () => {
    render(<GameQuestion />);
    
    const hintButtons = screen.getAllByText(/Pista/i);
  
    expect(hintButtons.length).toBe(4);
  });


  test('el tiempo restante se actualiza correctamente', async () => {
    render(<GameQuestion />);
    
    //verificamos que t0 es 60
    const timerText = screen.getByText(/^Tiempo restante:/);
    expect(timerText).toHaveTextContent("Tiempo restante: 60");
  
    //esperamos un segundo y verificamos que el tiempo ha cambiado
    jest.advanceTimersByTime(1000);  //el paso de 1 segundo
    await waitFor(() => {
      expect(screen.getByText(/^Tiempo restante:/)).toHaveTextContent("Tiempo restante: 59");
    });

  });
  

  test('solo 3 botones están deshabilitados al iniciar el juego', () => {
    render(<GameQuestion />);
  
    const optionButtons = screen.getAllByRole("button");
  
    //todos los botones deshabilitados
    const disabledButtons = optionButtons.filter(button => button.disabled);
  
    //verificamos que haya exactamente 3 botones deshabilitados
    expect(disabledButtons.length).toBe(3);
  
    // el resto de los botones deberian estar habilitados
    optionButtons.forEach(button => {
      if (!button.disabled) {
        expect(button).not.toBeDisabled();
      }
    });

  });
  
  

  
});
