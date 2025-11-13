import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { fetchOrders } from '../redux/actions/orderActions';

const MyOrdersPage = () => {
  const dispatch = useDispatch();

  const storeData = useSelector((state) => {
    return {
      orders: state?.orders?.orders || [],
      loading: state?.orders?.loading || false,
      error: state?.orders?.error,
    };
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'test') {
      dispatch(fetchOrders());
    }
  }, [dispatch]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error',
    };
    return statusColors[status?.toLowerCase()] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  if (storeData.loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (storeData.error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#ffebee' }}>
          <Typography variant="h6" color="error">Error loading orders</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {storeData.error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        My Orders
      </Typography>

      {storeData.orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start shopping to see your orders here
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {storeData.orders.map((order) => (
            <Card key={order.id} sx={{ boxShadow: 2 }}>
              <CardContent>
                {/* Order Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Order #{order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Placed on {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={order.status?.toUpperCase() || 'UNKNOWN'}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Order Items */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Items ({order.items?.length || 0})
                  </Typography>
                  <Grid container spacing={2}>
                    {order.items?.map((item, index) => (
                      <Grid item xs={12} key={item.id || index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Qty: {item.quantity} × {formatCurrency(item.priceAtOrder)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(item.totalPrice)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Order Summary */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Delivery Address:</strong>
                    </Typography>
                    {order.deliveryAddress ? (
                      <Box>
                        <Typography variant="body2">{order.deliveryAddress.name}</Typography>
                        <Typography variant="body2">{order.deliveryAddress.phone}</Typography>
                        <Typography variant="body2">
                          {order.deliveryAddress.address}, {order.deliveryAddress.city}
                        </Typography>
                        <Typography variant="body2">
                          {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Address not available
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Method:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.paymentMethod || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Status:
                        </Typography>
                        <Chip
                          label={order.paymentStatus?.toUpperCase() || 'PENDING'}
                          size="small"
                          color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                        />
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Total:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {formatCurrency(order.totalAmount)}
                        </Typography>
                      </Box>
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

export default MyOrdersPage;
