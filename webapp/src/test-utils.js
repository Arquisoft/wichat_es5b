import { render } from '@testing-library/react';
import { LanguageProvider } from './LanguageContext';

const defaultTranslations = {
  send: 'Enviar',
  placeholder: 'Escribe tu pregunta...',
  // Agrega otras claves de traducción que uses en el componente Chatbot
};

const customRender = (ui, options) =>
  render(
    <LanguageProvider value={{ translations: defaultTranslations }}>
      {ui}
    </LanguageProvider>,
    options
  );

export * from '@testing-library/react';
export { customRender as render };
