import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import Header from '../../components/grocery/Header';

const GiftCardsPage = () => {
  return (
    <Box>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          E-Gift Cards
        </Typography>

        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=200&fit=crop"
            alt="Gift Cards"
            sx={{ width: 200, height: 130, mx: 'auto', mb: 3, borderRadius: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            Send Gift Cards to Your Loved Ones
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Purchase and send digital gift cards for any occasion
          </Typography>
          <Alert severity="info">
            Gift card functionality coming soon!
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
};

export default GiftCardsPage;
