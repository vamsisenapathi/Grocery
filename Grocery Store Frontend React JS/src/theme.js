import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0c831f',
      dark: '#0a6b19',
      light: '#3da34f',
    },
    secondary: {
      main: '#f8cb46',
    },
    background: {
      default: '#f7f8f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1c1c',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Okra", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
