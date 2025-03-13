
import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mockAxios = new MockAdapter(axios);

describe('HintsButtons component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  //metodo para utilizar en el resto de pruebas, realiza el Login para evitar repeticion de codigo
  const login = async (username, password) => {
    render(<Login />);

    const usernameInput = await screen.getByLabelText(/Username/i);
    const passwordInput = await screen.getByLabelText(/Password/i);
    const loginButton = await screen.findByRole('button', { name: /Login/i });
    

    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });
    mockAxios.onPost('http://localhost:8000/askllm').reply(200, { answer: 'Hello test user' });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: username } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.click(loginButton);
    });

    const startButton = await screen.findByRole('button');
    fireEvent.click(startButton);
  };
  it('should do nothing', async () => {});
  
  /*
  it('should show hints when hint buttons are clicked', async () => {
    await login('testUser', 'testPassword');

    //verificar que inicialmente haya 8 botones (4 de opciones y 4 de pistas)
    const buttonsBeforeClick = await screen.findAllByRole('button');
    await waitFor(() => expect(buttonsBeforeClick).toHaveLength(8));

    const firstHintButton = buttonsBeforeClick.find(button => button.textContent === 'Primera Pista' && !button.disabled);

    //simular el clic en el primer boton
    await act(async () => {
      fireEvent.click(firstHintButton);
    });

    // verificar que despues del clic hay un boton menos
    const buttonsAfterClick = await screen.findAllByRole('button');
    await waitFor(() => expect(buttonsAfterClick).toHaveLength(7));
  });

  it('should disable hint buttons until the previous one is used', async () => {
    await login('testUser', 'testPassword');

    // obtener el segundo boton de pistas
    const secondHintButton = await screen.findByRole('button', { name: /Segunda Pista/i });

    //verificar que el segundo boton esta deshabilitado visualmente
    expect(secondHintButton).toHaveClass('Mui-disabled');

    // simular el clic en el primer boton de pistas
    const firstHintButton = await screen.findByRole('button', { name: /Primera Pista/i });

    await act(async () => {
      fireEvent.click(firstHintButton);
    });

    //verificar que el segundo boton ya no tiene la clase Mui-disabled (ahora deberia estar habilitado)
    const updatedSecondHintButton = await screen.findByRole('button', { name: /Segunda Pista/i });

    await waitFor(() => {
      expect(updatedSecondHintButton).not.toHaveClass('Mui-disabled');
    });
  });*/
});