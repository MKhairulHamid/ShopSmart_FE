import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  ShoppingCart,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
} from '@mui/icons-material'
import { orderApi } from '../services/api'
import { useCustomer } from '../context/CustomerContext'
import { OrderStatus } from '../types'

const OrderHistory: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { customer, isAuthenticated } = useCustomer()

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register?redirect=orders')
    }
  }, [isAuthenticated, navigate])

  // Fetch customer orders
  const { 
    data: orders = [], 
    isLoading, 
    error 
  } = useQuery(
    ['customer-orders', customer?.id],
    () => customer ? orderApi.getCustomerOrders(customer.id) : [],
    {
      enabled: !!customer?.id,
    }
  )

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <Schedule color="warning" />
      case OrderStatus.Processing:
        return <Schedule color="info" />
      case OrderStatus.Shipped:
        return <LocalShipping color="primary" />
      case OrderStatus.Delivered:
        return <CheckCircle color="success" />
      case OrderStatus.Cancelled:
        return <Cancel color="error" />
      default:
        return <Schedule />
    }
  }

  const getStatusColor = (status: OrderStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case OrderStatus.Pending:
        return 'warning'
      case OrderStatus.Processing:
        return 'info'
      case OrderStatus.Shipped:
        return 'primary'
      case OrderStatus.Delivered:
        return 'success'
      case OrderStatus.Cancelled:
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'Pending'
      case OrderStatus.Processing:
        return 'Processing'
      case OrderStatus.Shipped:
        return 'Shipped'
      case OrderStatus.Delivered:
        return 'Delivered'
      case OrderStatus.Cancelled:
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load order history. Please try again.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Order History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 8, px: 4 }}>
          <Receipt sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            No orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start shopping to see your orders here.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card elevation={2}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    {/* Order Info */}
                    <Grid item xs={12} md={3}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Order #{order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {getStatusIcon(order.status)}
                          <Chip
                            label={getStatusText(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Order Items Preview */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {order.orderItems.slice(0, 3).map((item) => (
                          <Avatar
                            key={item.id}
                            src={item.product?.imageUrl}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          >
                            <ShoppingCart />
                          </Avatar>
                        ))}
                        {order.orderItems.length > 3 && (
                          <Avatar
                            variant="rounded"
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: 'grey.200',
                              color: 'text.secondary',
                              fontSize: '0.75rem'
                            }}
                          >
                            +{order.orderItems.length - 3}
                          </Avatar>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                      </Typography>
                    </Grid>

                    {/* Total Amount */}
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${order.totalAmount.toFixed(2)}
                      </Typography>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                        {order.status === OrderStatus.Delivered && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate('/products')}
                          >
                            Buy Again
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Mobile Layout for Order Items */}
                  {isMobile && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Order Items:
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Product</TableCell>
                              <TableCell align="right">Qty</TableCell>
                              <TableCell align="right">Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.orderItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                      src={item.product?.imageUrl}
                                      variant="rounded"
                                      sx={{ width: 32, height: 32, mr: 1 }}
                                    >
                                      <ShoppingCart />
                                    </Avatar>
                                    <Typography variant="body2">
                                      {item.product?.name || 'Unknown Product'}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  {item.quantity}
                                </TableCell>
                                <TableCell align="right">
                                  ${item.totalPrice.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {/* Shipping Address */}
                  <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ship to:</strong> {order.fullShippingAddress}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Statistics */}
      {orders.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Order Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {orders.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {orders.filter(o => o.status === OrderStatus.Delivered).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivered
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {orders.filter(o => o.status === OrderStatus.Processing || o.status === OrderStatus.Shipped).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  )
}

export default OrderHistory
