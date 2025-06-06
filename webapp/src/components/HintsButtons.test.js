import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '../test-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import HintsButtons from './HintsButtons';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


const mockAxios = new MockAdapter(axios);
const mockSetScore = jest.fn();

describe('HintsButtons component', () => {
  beforeEach(() => {
    mockAxios.reset();
    const llmQuestions= ["Pista 1", "Pista 2", "Pista 3", "Pista 4"]
    render(<HintsButtons questionsLlm={llmQuestions} setScore={mockSetScore}/>);

    mockAxios.onPost(apiEndpoint+'/askllm').reply(200, { answer: 'Hello test user' });
    mockAxios.onPost(apiEndpoint + '/hintUsed').reply(200,  { score: -5 }); // Asegurar respuesta asíncrona
  });
  
  it('should show hints when hint buttons are clicked', async () => {

    //verificar que inicialmente haya 8 botones (4 de opciones y 4 de pistas)
    const buttonsBeforeClick = await screen.findAllByRole('button');
    await waitFor(() => expect(buttonsBeforeClick).toHaveLength(4));

    const firstHintButton = buttonsBeforeClick.find(button => button.textContent === 'Primera Pista' && !button.disabled);

    //simular el clic en el primer boton
    await act(async () => {
      fireEvent.click(firstHintButton);
    });

    // verificar que despues del clic hay un boton menos
    const buttonsAfterClick = await screen.findAllByRole('button');
    await waitFor(() => expect(buttonsAfterClick).toHaveLength(3));
  });

  it('should disable hint buttons until the previous one is used', async () => {

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
  });

});
