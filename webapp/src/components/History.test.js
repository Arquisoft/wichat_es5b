import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import History from './History';
import MockAdapter from 'axios-mock-adapter';



const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


//mockeo llamadas a base de datos
const mockAxios = new MockAdapter(axios);
mockAxios.onPost(apiEndpoint+'/history').reply(200, [{ username: 'prueba' , date: 'hoy',correctAnswers: 2, wrongAnswers:4 }]);

describe('History Component', () => {

    it('Aparece el boton incialmente', () => {
        render(<History username={'prueba'} />);
        expect(screen.getByText('HISTORIAL')).toBeInTheDocument();
    });
  
    it('Se despliega al pulsar el boton', async () => {
        render(<History username={'prueba'} />);
        fireEvent.click(screen.getByText("HISTORIAL"));
        await waitFor(() => {
            expect(screen.getByText("Cerrar")).toBeInTheDocument();
          });
        expect(screen.getByText('Historial')).toBeInTheDocument();
    });

    it('Se cierra al pulsar el boton', async () => {
        render(<History username={'prueba'} />);
        fireEvent.click(screen.getByText("HISTORIAL"));
        await waitFor(() => {
            expect(screen.getByText("Cerrar")).toBeInTheDocument();
          });
        fireEvent.click(screen.getByText("Cerrar"));
        expect(screen.getByText('HISTORIAL')).toBeInTheDocument();
    });

    it('Aparece la tabla', async () => {
        render(<History username={'prueba'} />);
        fireEvent.click(screen.getByText("HISTORIAL"));
        await waitFor(() => {
            expect(screen.getByText("Cerrar")).toBeInTheDocument();
          });
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('La tabla no aparece si no hay usuario', async () => {
        render(<History />);
        fireEvent.click(screen.getByText("HISTORIAL"));
        await waitFor(() => {
            expect(screen.getByText("Cerrar")).toBeInTheDocument();
          });
        expect(screen.getByText('Debe iniciar sesión para ver su historial')).toBeInTheDocument();
    })
});