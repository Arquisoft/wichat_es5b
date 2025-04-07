// UpdateUsername.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateUsername from './UpdateUsername';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

jest.mock('axios');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('UpdateUsername component', () => {
  beforeEach(() => {
    // Mocks necesarios para el token
    localStorage.setItem('token', 'mocked-token');
    jwtDecode.mockReturnValue({ userId: 'user123' });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should open dialog when menu item is clicked', () => {
    render(<UpdateUsername />);

    const menuItem = screen.getByRole('menuitem', { name: /Editar nombre de usuario/i });
    fireEvent.click(menuItem);

    expect(screen.getByText(/Edite su nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Nombre de usuario/i })).toBeInTheDocument();
  });

  it('should allow input and call axios with correct data on submit', async () => {
    axios.post.mockResolvedValueOnce({}); // mock éxito

    render(<UpdateUsername />);

    const menuItem = screen.getByRole('menuitem', { name: /Editar nombre de usuario/i });
    fireEvent.click(menuItem);

    const input = screen.getByRole('textbox', { name: /Nombre de usuario/i });
    fireEvent.change(input, { target: { value: 'nuevo_usuario' } });

    const submitBtn = screen.getByRole('button', { name: /Actualizar nombre de usuario/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/updateusername'), {
        userId: 'user123',
        newUsername: 'nuevo_usuario',
      });
    });

    expect(await screen.findByText(/Nombre de usuario modificado correctamente/i)).toBeInTheDocument();
  });

  it('should show error message when request fails', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Nombre no válido' } },
    });

    render(<UpdateUsername />);

    fireEvent.click(screen.getByRole('menuitem', { name: /Editar nombre de usuario/i }));

    fireEvent.change(screen.getByRole('textbox', { name: /Nombre de usuario/i }), {
      target: { value: 'usuario_invalido' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Actualizar nombre de usuario/i }));

    expect(await screen.findByText(/Nombre no válido/i)).toBeInTheDocument();
  });
});
