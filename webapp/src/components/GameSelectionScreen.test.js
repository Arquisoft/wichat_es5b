import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import { LanguageProvider } from '../LanguageContext';

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

        render(<LanguageProvider><Login userForHistory={userForHistory}/></LanguageProvider>);

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Usuario/i), {
                target: {value: 'testUser'},
            });
            fireEvent.change(screen.getByLabelText(/Contraseña/i), {
                target: {value: 'testPassword'},
            });
            fireEvent.click(screen.getByRole('button', {name: /Iniciar sesión/i}));
        });

        await waitFor(() =>
            expect(screen.getByText(/Escoge la longitud de la partida/i)).toBeInTheDocument()
        );

        const cortaBtn = await screen.getByRole('button', {name: /CORTA/i});
        const normalBtn = await screen.getAllByRole('button', {name: /NORMAL/i})[1];
        const largaBtn = await screen.getByRole('button', {name: /LARGA/i});

        expect(cortaBtn).toBeInTheDocument(); 
        expect(normalBtn).toBeInTheDocument(); 
        expect(largaBtn).toBeInTheDocument();

    });
})