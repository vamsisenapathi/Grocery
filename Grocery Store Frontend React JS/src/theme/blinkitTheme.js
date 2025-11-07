import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0C831F', // Blinkit Green
      light: '#4CAF50',
      dark: '#087F23',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F8C51B', // Blinkit Yellow/Orange for offers
      light: '#FDD835',
      dark: '#F57F17',
      contrastText: '#000000',
    },
    background: {
      default: '#f8f9fa', // Light grey background
      paper: '#ffffff',
    },
    text: {
      primary: '#282c3f', // Dark grey for primary text
      secondary: '#535665', // Medium grey for secondary text
    },
    success: {
      main: '#0C831F',
      light: '#4CAF50',
      dark: '#087F23',
    },
    warning: {
      main: '#F8C51B',
      light: '#FDD835',
      dark: '#F57F17',
    },
    error: {
      main: '#e23744',
      light: '#ff6b6b',
      dark: '#c92a2a',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Poppins"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none', // Blinkit uses sentence case
      letterSpacing: '0.02em',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    overline: {
      fontWeight: 500,
      fontSize: '0.625rem',
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  spacing: 8, // 8px base spacing
  shape: {
    borderRadius: 8, // Blinkit uses smaller border radius
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#bdbdbd #f5f5f5',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 6,
            height: 6,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 3,
            backgroundColor: '#bdbdbd',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
          '&:focus': {
            boxShadow: '0px 0px 0px 3px rgba(12, 131, 31, 0.2)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0C831F',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#087F23',
          },
          '&:active': {
            backgroundColor: '#065A18',
          },
        },
        containedSecondary: {
          backgroundColor: '#F8C51B',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#F57F17',
          },
        },
        outlined: {
          borderColor: '#e0e0e0',
          color: '#282c3f',
          '&:hover': {
            borderColor: '#0C831F',
            backgroundColor: 'rgba(12, 131, 31, 0.04)',
          },
        },
        text: {
          color: '#535665',
          '&:hover': {
            backgroundColor: 'rgba(12, 131, 31, 0.04)',
          },
        },
        small: {
          padding: '6px 12px',
          fontSize: '0.75rem',
        },
        large: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f0f0f0',
          '&:hover': {
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: '#0C831F',
          color: '#ffffff',
        },
        colorSecondary: {
          backgroundColor: '#F8C51B',
          color: '#000000',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0C831F',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0C831F',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#282c3f',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#e23744',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.65rem',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#0C831F',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#087F23',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;