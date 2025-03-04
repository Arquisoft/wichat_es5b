import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  

  it('should log in successfully', async () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });
    mockAxios.onPost('http://localhost:8000/askllm').reply(200, { answer: 'Hello test user' });

    // Simulate user input
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });

    // Verify that the user information is displayed
    expect(screen.getByText(/Your account was created on 1\/1\/2024/i)).toBeInTheDocument();
  });

  it('should handle error when logging in', async () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Unauthorized' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });

    // Verify that the user information is not displayed
    expect(screen.queryByText(/Hello testUser!/i)).toBeNull();
    expect(screen.queryByText(/Your account was created on/i)).toBeNull();
  });

  

  it('should show hints when hint buttons are clicked', async () => {
    
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });
    mockAxios.onPost('http://localhost:8000/askllm').reply(200, { answer: 'Hello test user' });

    
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });
      
    //despues de etrar correctamente checkeamos la funcionalidad
    
    const buttonsBeforeClick = await screen.findAllByRole('button');
  
    //verificar que inicialmente haya 4 botones
    expect(buttonsBeforeClick).toHaveLength(4);
  
    const firstHintButton = buttonsBeforeClick.find(button => button.textContent === 'Primera Pista');
  
    //simular el clic en el primer boton
    await act(async () => {
      fireEvent.click(firstHintButton);
    });
  
    //todos los botones despues del clic
    const buttonsAfterClick = await screen.findAllByRole('button');
  
    //verificar que despues del clic hay un boton menos
    expect(buttonsAfterClick).toHaveLength(3); 
  });
  
  

  it('should disable hint buttons until the previous one is used', async () => {
    
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });
    mockAxios.onPost('http://localhost:8000/askllm').reply(200, { answer: 'Hello test user' });

    
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });
  
    //obtener el segundo boton de pistas
    const secondHintButton = await screen.findByRole('button', { name: /Segunda Pista/i });
  
    //segundo boton tiene la clase Mui-disabled (deshabilitado visualmente)
    expect(secondHintButton).toHaveClass('Mui-disabled');
  
    //simular el clic en el primer boton de pistas
    const firstHintButton = await screen.findByRole('button', { name: /Primera Pista/i });
  
    await act(async () => {
      fireEvent.click(firstHintButton);
    });
  
    //verificar que el segundo boton ya no tiene la clase Mui-disabled (ahora deberia estar habilitado)
    expect(secondHintButton).not.toHaveClass('Mui-disabled');
  });
  


});
