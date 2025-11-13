import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import App from './App';
import theme from './theme';
import store from './redux/store';
import { LocationProvider } from './context/LocationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LocationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000}>
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </LocationProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
