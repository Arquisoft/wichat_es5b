import React from 'react';
import { render, screen } from '../test-utils';
import NavMenu from './NavMenu';



describe('NavMenu Component', () => {

    it('Aparecen todos los componentes del Menu', () => {
        render(<NavMenu />);
        expect(screen.getByText('IDENTIFICATE')).toBeInTheDocument();
        expect(screen.getByText('IDIOMA - ES')).toBeInTheDocument();
        expect(screen.getByText('HISTORIAL')).toBeInTheDocument();
        expect(screen.getByText('RANKING')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});