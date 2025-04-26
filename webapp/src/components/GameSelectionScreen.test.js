import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import { LanguageProvider } from '../LanguageContext';


const mockAxios = new MockAdapter(axios);

const userForHistory = jest.fn();

describe('Game selection screen', () => {
    beforeEach(() => {
        mockAxios.reset();
        jest.clearAllMocks();
        mockAxios.onPost('http://localhost:8000/login').reply(200, {
            token: 'test-token',
            createdAt: '2024-01-01T12:34:56Z',
        });

        mockAxios.onPost('http://localhost:8000/askllm').reply(200, {
            answer: 'Hello test user',
        });
    });

    it('should disable the selected game length button', async () => {
        

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

        expect(cortaBtn).toHaveClass('MuiButton-contained'); 
        expect(normalBtn).toHaveClass('MuiButton-outlined'); 
        expect(largaBtn).toHaveClass('MuiButton-outlined'); 

        await fireEvent.click(normalBtn);

        expect(normalBtn).toHaveClass('MuiButton-contained');
        expect(cortaBtn).toHaveClass('MuiButton-outlined'); 
        expect(largaBtn).toHaveClass('MuiButton-outlined');

        await fireEvent.click(largaBtn);

        expect(normalBtn).toHaveClass('MuiButton-outlined');
        expect(cortaBtn).toHaveClass('MuiButton-outlined'); 
        expect(largaBtn).toHaveClass('MuiButton-contained');

    });

    it('should disable the selected game mode button', async () => {
        

        render(<LanguageProvider><Login userForHistory={userForHistory}/></LanguageProvider>);

        await waitFor(() =>
            expect(screen.getByText(/Escoge la longitud de la partida/i)).toBeInTheDocument()
        );

        const normalBtn = await screen.getAllByRole('button', {name: /NORMAL/i})[0];
        const batBtn = await screen.getByRole('button', {name: /Batería/i});

        expect(normalBtn).toHaveClass('MuiButton-contained');
        expect(batBtn).toHaveClass('MuiButton-outlined'); 

        await fireEvent.click(batBtn);

        expect(normalBtn).toHaveClass('MuiButton-outlined');
        expect(batBtn).toHaveClass('MuiButton-contained'); 

    });

    it('should try to start The Game', async () => {
        

        mockAxios.onPost('http://localhost:8000/start').reply(200, {});

        render(<LanguageProvider><Login userForHistory={userForHistory}/></LanguageProvider>);

        const actiontbn = await screen.getByRole('button', {name: /Acción/i});
        fireEvent.click(actiontbn);

        expect(screen.getByText(/Preparando las palomitas.../i)).toBeInTheDocument();
    });
})