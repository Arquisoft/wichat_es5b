import React from 'react';
import { render, fireEvent, screen, waitFor } from '../test-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from './AddUser';

const mockAxios = new MockAdapter(axios);

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should add user successfully', async () => {
    render(<AddUser />);

    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const addUserButton = screen.getByRole('button', { name: /Crear Usuario/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword1' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Usuario añadido correctamente/i)).toBeInTheDocument();
    });
  });

  it('should handle error when adding user', async () => {
    render(<AddUser />);

    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const addUserButton = screen.getByRole('button', { name: /Crear Usuario/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword1' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument();
    });
  });
});
