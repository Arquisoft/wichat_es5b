// PreguntasHistorico.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PreguntasHistorico from './PreguntasHistorico';

describe('PreguntasHistorico tests', () => {
  it('Se muestra el botón', () => {
    const user = { questions: [] };
    render(<PreguntasHistorico user={user} />);
    expect(screen.getByText('Mostrar Preguntas')).toBeInTheDocument();
  });
  
  it('Se maneja el cierre del dialog', () => {
    const user = { questions: [{ text: 'Pregunta 1', image: 'imagen1', options: ['a', 'b', 'c','d'], correctOption: 'a'}] };
    render(<PreguntasHistorico user={user} />);
    const button = screen.getByText('Mostrar Preguntas');
    fireEvent.click(button);
    expect(screen.getByText('Historial de Preguntas')).toBeInTheDocument();
    const close = screen.getByText('Cerrar');
    fireEvent.click(close);
    expect(screen.queryByText('Historial')).not.toBeInTheDocument();
  });
});