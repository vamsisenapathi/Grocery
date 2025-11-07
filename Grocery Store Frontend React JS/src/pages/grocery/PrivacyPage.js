import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import Header from '../../components/grocery/Header';

const PrivacyPage = () => {
  return (
    <Box>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Account Privacy
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage your privacy preferences and data settings
          </Typography>

          <List>
            <ListItem>
              <ListItemText 
                primary="Share order data for personalized recommendations"
                secondary="Allow us to use your order history to suggest products"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label=""
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Enable notifications"
                secondary="Receive updates about orders and special offers"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label=""
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Share location data"
                secondary="Help us provide accurate delivery estimates"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label=""
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
