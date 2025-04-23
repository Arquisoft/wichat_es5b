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

    // Simulate user input
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });

    // Verify that the user information is displayed
    expect(screen.getByText(/¡Acción!/i)).toBeInTheDocument();
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

  it('sets username and createdAt when token is present', () => {
    jest.spyOn(localStorage, 'getItem').mockImplementation((field) => {
      if (field === 'token') {
        return 'some-token';
      }
      if (field === 'username') {
        return 'test-username';
      }
      if (field === 'createdAt') {
        return '2022-01-01T12:00:00.000Z';
      }
    });

    localStorage.setItem('token', 'some-token');
    localStorage.setItem('username', 'test-username');
    localStorage.setItem('createdAt', '2022-01-01T12:00:00.000Z');
    render(<Login userForHistory={userForHistory}/>);
    expect(localStorage.username).not.toBe(null);
    expect(localStorage.createdAt).not.toBe(null);
  });

  it('parses createdAt date correctly', () => {
    jest.spyOn(localStorage, 'getItem').mockImplementation((field) => {
      if (field === 'token') {
        return 'some-token';
      }
      if (field === 'username') {
        return 'test-username';
      }
      if (field === 'createdAt') {
        return '2022-01-01T12:00:00.000Z';
      }
    });

    localStorage.setItem('token', 'some-token');
    localStorage.setItem('username', 'test-username');
    localStorage.setItem('createdAt', '2022-01-01T12:00:00.000Z');
    render(<Login userForHistory={userForHistory}/>);
    expect(localStorage.createdAt).toBe('2022-01-01T12:00:00.000Z');
  });
  
});