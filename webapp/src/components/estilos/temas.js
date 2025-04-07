import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4abcb0', // verde agua para los botones
            contrastText: '#000000', // texto negro
        },
        secondary: {
            main: '#cc5c24', // naranja para posibles otros elementos
        },
    },
});

export default theme;
