// PreguntasHistorico.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PreguntasHistorico from './PreguntasHistorico';
import { LanguageProvider } from '../LanguageContext';

describe('PreguntasHistorico tests', () => {
  it('Se muestra el botón', () => {
    const user = { questions: [] };
    render(<LanguageProvider><PreguntasHistorico user={user} /></LanguageProvider>);
    expect(screen.getByText('Mostrar Preguntas')).toBeInTheDocument();
  });
  
  it('Se maneja el cierre del dialog', () => {
    const user = { questions: [{ question: {es:'Pregunta 1'}, image: 'imagen1', option1: 'a', option2: 'b', option3: 'c', option4: 'd', correctOption: 'a'}] };
    render(<LanguageProvider><PreguntasHistorico user={user} /></LanguageProvider>);
    const button = screen.getByText('Mostrar Preguntas');
    fireEvent.click(button);
    expect(screen.getByText('Historial de Preguntas')).toBeInTheDocument();
    const close = screen.getByText('Cerrar');
    fireEvent.click(close);
    expect(screen.queryByText('Historial')).not.toBeInTheDocument();
  });
});