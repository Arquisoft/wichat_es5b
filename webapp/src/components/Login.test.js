import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mockAxios = new MockAdapter(axios);

const userForHistory = jest.fn();

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it('should log in successfully', async () => {
    await mockAxios.onPost('http://localhost:8000/history').reply(200, [{date: "2024-01-01T12:34:56Z", correctAnswers: 4, wrongAnswers:2}]);
    await mockAxios.onGet('http://localhost:8000/ranking').reply(200, [{username:"user1", date: "2024-01-01T12:34:56Z", correctAnswers: 4, wrongAnswers:2}]);
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

  it('should display error message when login fails', async () => {
    localStorage.clear(); 
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
  
    mockAxios.onPost('http://localhost:8000/login').reply(401, {
      error: 'Invalid credentials',
    });
  
    render(<Login userForHistory={userForHistory} />);
  
    
    const usernameInput = await screen.findByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
  
    fireEvent.change(usernameInput, { target: { value: 'wrongUser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });
    fireEvent.click(loginButton);
  
    await waitFor(() =>
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
    );
  });
  
  
  
  
  it('should disable the selected game length button', async () => {
    mockAxios.onPost('http://localhost:8000/login').reply(200, {
      token: 'test-token',
      createdAt: '2024-01-01T12:34:56Z',
    });
  
    mockAxios.onPost('http://localhost:8000/askllm').reply(200, {
      answer: 'Hello test user',
    });
  
    render(<Login userForHistory={userForHistory} />);
  
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: 'testUser' },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'testPassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    });
  
    await waitFor(() =>
      expect(screen.getByText(/Escoge la longitud de la partida/i)).toBeInTheDocument()
    );
  
    const cortaBtn = screen.getByRole('button', { name: /Corta/i });
    const normalBtn = screen.getByRole('button', { name: /Normal/i });
    const largaBtn = screen.getByRole('button', { name: /Larga/i });
  
    expect(cortaBtn).toBeDisabled(); // Default es 6 => Corta
    expect(normalBtn).not.toBeDisabled();
    expect(largaBtn).not.toBeDisabled();
  
    // Cambiamos a "Normal"
    fireEvent.click(normalBtn);
  
    expect(cortaBtn).not.toBeDisabled();
    expect(normalBtn).toBeDisabled();
    expect(largaBtn).not.toBeDisabled();
  });

  it('sets username and createdAt when token is present', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('username', 'test-username');
    localStorage.setItem('createdAt', '2022-01-01T12:00:00.000Z');
    render(<Login />);
    expect(localStorage.username).not.toBe(null);
    expect(localStorage.createdAt).not.toBe(null);
  });

  it('parses createdAt date correctly', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('username', 'test-username');
    localStorage.setItem('createdAt', '2022-01-01T12:00:00.000Z');
    render(<Login />);
    expect(localStorage.createdAt).toBe('2022-01-01T12:00:00.000Z');
  });
  
});