import { render } from '@testing-library/react';
import { LanguageProvider } from './LanguageContext';

const customRender = (ui, options) =>
  render(<LanguageProvider>{ui}</LanguageProvider>, options);

export * from '@testing-library/react';
export { customRender as render };
