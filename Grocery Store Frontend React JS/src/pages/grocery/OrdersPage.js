import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import Header from '../../components/grocery/Header';

const OrdersPage = () => {
  // Mock orders data
  const orders = [
    {
      id: '12345',
      date: 'Nov 7, 2025',
      status: 'Delivered',
      items: 4,
      total: 457,
      deliveryTime: '8 mins',
    },
  ];

  return (
    <Box>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          My Orders
        </Typography>

        {orders.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=300&fit=crop"
              alt="No orders"
              sx={{ width: 200, height: 200, mx: 'auto', mb: 3, opacity: 0.5 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Oops! You haven't placed any orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start shopping to see your orders here
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.date} • Delivered in {order.deliveryTime}
                      </Typography>
                    </Box>
                    <Chip label={order.status} color="success" size="small" />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {order.items} items
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      ₹{order.total.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default OrdersPage;
