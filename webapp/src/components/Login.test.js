import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mockAxios = new MockAdapter(axios);

const userForHistory = () =>{

}

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  

  it('should log in successfully', async () => {
    await mockAxios.onPost('http://localhost:8006/history').reply(200, [{date: "2024-01-01T12:34:56Z", correctAnswers: 4, wrongAnswers:2}]);
    await mockAxios.onGet('http://localhost:8006/ranking').reply(200, [{username:"user1", date: "2024-01-01T12:34:56Z", correctAnswers: 4, wrongAnswers:2}]);
    render(<Login userForHistory={userForHistory}/>);
    

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
    expect(screen.getByText(/Start Game/i)).toBeInTheDocument();
  });

  it('should handle error when logging in', async () => {
    render(<Login userForHistory={userForHistory}/>);

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
      expect(screen.getByText(/Unauthorized/i)).toBeInTheDocument();
    });

    // Verify that the user information is not displayed
    expect(screen.queryByText(/Hello testUser!/i)).toBeNull();
    expect(screen.queryByText(/Your account was created on/i)).toBeNull();
  });

  it('deben llenarse los campos para iniciar sesion', async () => {
    render(<Login userForHistory={userForHistory}/>);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    await expect(screen.getByText("Username and password are required")).toBeInTheDocument();
  });

  it('El botón de volver debe aparecer', async () => {
    await mockAxios.onPost('http://localhost:8006/history').reply(200, [{date: "2024-01-01T12:34:56Z", correctAnswers: 4, wrongAnswers:2}]);
    await mockAxios.onGet('http://localhost:8006/ranking').reply(200, [{username:"user1", date: "2024-01-01T12:34:56Z", correctAnswers: 4, wrongAnswers:2}]);
    render(<Login userForHistory={userForHistory}/>);
    

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
    
      mockAxios.onGet('../Game').reply(200, {
        componente: () => <p>Mock de Game</p>,
      });

      await fireEvent.click(screen.getByRole('button', { name: /Start Game/i }));

      await expect(screen.getByText("Reiniciar")).toBeInTheDocument();
      });

  })

  

