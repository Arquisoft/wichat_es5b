import React from 'react';
import { render, screen } from '../../test-utils';
import GameOver from './GameOver';

describe('GameOver Component', () => {

        it('Se muestra el numero de las preguntas correctas', ()=> {
            render(<GameOver correct={2} wrong={4} username={"prueba"} score={100} />)
            expect(screen.getByText("Preguntas Correctas")).toBeInTheDocument();
        });

        it('Se muestra el numero de las preguntas incorrectas', ()=> {
            render(<GameOver correct={2} wrong={4} username={"prueba"} score={100} />)
            expect(screen.getByText("Preguntas Incorrectas")).toBeInTheDocument();
        });
    });