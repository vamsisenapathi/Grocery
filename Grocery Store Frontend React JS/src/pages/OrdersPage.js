import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storeData = useSelector((state) => {
    return {
      isAuthenticated: state?.auth?.isAuthenticated,
    };
  });

  const { isAuthenticated } = storeData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simulate loading orders - replace with actual API call
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // For now, show a placeholder message since we don't have orders functionality yet
        setTimeout(() => {
          setOrders([]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Orders Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            You haven't placed any orders yet. Start shopping to see your orders here!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Note: Order functionality is currently under development. 
            Your cart items will be converted to orders in a future update.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {orders.map((order) => (
            <Card key={order.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Placed on {formatDate(order.createdAt)}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Items:
                      </Typography>
                      {order.items?.map((item, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {item.productName} × {item.quantity} - {formatPrice(item.subtotal)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box textAlign={{ xs: 'left', md: 'right' }}>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" color="primary">
                        Total: {formatPrice(order.total)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrdersPage;