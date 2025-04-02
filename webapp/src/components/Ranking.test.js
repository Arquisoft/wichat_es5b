import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Ranking from './Ranking';
import MockAdapter from 'axios-mock-adapter';



const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


//mockeo llamadas a base de datos
const mockAxios = new MockAdapter(axios);
mockAxios.onGet(apiEndpoint+'/ranking').reply(200, [{ username: 'prueba' , date: 'hoy',correctAnswers: 2, wrongAnswers:4 }]);

describe('Ranking Component', () => {

    it('Aparece el boton incialmente', () => {
        render(<Ranking />);
        expect(screen.getByText('RANKING')).toBeInTheDocument();
    });

    it('Aparece el boton de cierre y el titulo', async () => {
        render(<Ranking />);
        fireEvent.click(screen.getByText("RANKING"));
        await waitFor(() => {
            expect(screen.getByText("Cerrar")).toBeInTheDocument();
        });
        expect(screen.getByText('Ranking')).toBeInTheDocument();
    });

    it('El boton de cierre cierra el dialog', async () => {
        render(<Ranking />);
        fireEvent.click(screen.getByText("RANKING"));
        await waitFor(() => {
            expect(screen.getByText("Cerrar")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Cerrar"));
        expect(screen.getByText('RANKING')).toBeInTheDocument();
    });
});