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

    it('should disable the selected game length button', async () => {
        mockAxios.onPost('http://localhost:8000/login').reply(200, {
            token: 'test-token',
            createdAt: '2024-01-01T12:34:56Z',
        });

        mockAxios.onPost('http://localhost:8000/askllm').reply(200, {
            answer: 'Hello test user',
        });

        render(<Login userForHistory={userForHistory}/>);

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Username/i), {
                target: {value: 'testUser'},
            });
            fireEvent.change(screen.getByLabelText(/Password/i), {
                target: {value: 'testPassword'},
            });
            fireEvent.click(screen.getByRole('button', {name: /Login/i}));
        });

        await waitFor(() =>
            expect(screen.getByText(/Escoge la longitud de la partida/i)).toBeInTheDocument()
        );

        const cortaBtn = screen.getByRole('button', {name: /CORTA/i});
        const normalBtn = screen.getByRole('button', {name: /NORMAL/i});
        const largaBtn = screen.getByRole('button', {name: /LARGA/i});

        expect(cortaBtn).toBeDisabled(); // Default es 6 => Corta
        expect(normalBtn).not.toBeDisabled();
        expect(largaBtn).not.toBeDisabled();

        // Cambiamos a "Normal"
        fireEvent.click(normalBtn);

        expect(cortaBtn).not.toBeDisabled();
        expect(normalBtn).toBeDisabled();
        expect(largaBtn).not.toBeDisabled();
    });
})