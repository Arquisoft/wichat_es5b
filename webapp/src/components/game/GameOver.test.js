import React from 'react';
import { render, screen } from '../../test-utils';
import GameOver from './GameOver';

describe('GameOver Component', () => {

        it('Se muestra el numero de las preguntas correctas', ()=> {
            render(<GameOver correct={2} wrong={4} username={"prueba"} />)
            expect(screen.getByText("Respuestas correctas: 2")).toBeInTheDocument();
        });

        it('Se muestra el numero de las preguntas incorrectas', ()=> {
            render(<GameOver correct={2} wrong={4} username={"prueba"} />)
            expect(screen.getByText("Respuestas incorrectas: 4")).toBeInTheDocument();
        });
    });