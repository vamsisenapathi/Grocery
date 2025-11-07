import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import theme from './theme/blinkitTheme';

// Simple test component
const TestHome = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h3">Application Running!</Typography>
    <Typography variant="body1">If you see this, the app is working.</Typography>
  </Box>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Router>
            <Routes>
              <Route path="*" element={<TestHome />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
