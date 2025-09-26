import React from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'
import {
  ArrowBack,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Schedule,
  Cancel,
  Receipt,
  Print,
} from '@mui/icons-material'
import { orderApi } from '../services/api'
import { useCustomer } from '../context/CustomerContext'
import { OrderStatus } from '../types'

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { customer, isAuthenticated } = useCustomer()
  
  const orderId = id ? parseInt(id, 10) : 0
  const isSuccess = searchParams.get('success') === 'true'

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register?redirect=orders')
    }
  }, [isAuthenticated, navigate])

  // Fetch order details
  const { 
    data: order, 
    isLoading, 
    error 
  } = useQuery(
    ['order', orderId],
    () => orderApi.getOrder(orderId),
    {
      enabled: !!orderId && isAuthenticated,
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

  const getActiveStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 0
      case OrderStatus.Processing:
        return 1
      case OrderStatus.Shipped:
        return 2
      case OrderStatus.Delivered:
        return 3
      case OrderStatus.Cancelled:
        return -1
      default:
        return 0
    }
  }

  const orderSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

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

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Order not found or failed to load.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Message */}
      {isSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order placed successfully!
          </Typography>
          <Typography>
            Thank you for your purchase. Your order #{order.orderNumber} has been received and is being processed.
          </Typography>
        </Alert>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ textDecoration: 'none' }}
        >
          Home
        </MuiLink>
        <MuiLink
          component="button"
          variant="body2"
          onClick={() => navigate('/orders')}
          sx={{ textDecoration: 'none' }}
        >
          Orders
        </MuiLink>
        <Typography color="text.primary" variant="body2">
          Order #{order.orderNumber}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            Order #{order.orderNumber}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Placed on {new Date(order.orderDate).toLocaleDateString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Order Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {getStatusIcon(order.status)}
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                Order Status: 
              </Typography>
              <Chip
                label={getStatusText(order.status)}
                color={getStatusColor(order.status)}
                sx={{ ml: 2 }}
              />
            </Box>

            {order.status !== OrderStatus.Cancelled && (
              <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
                {orderSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            {order.status === OrderStatus.Cancelled && (
              <Alert severity="error">
                This order has been cancelled.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Order Items
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
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
                            sx={{ width: 60, height: 60, mr: 2 }}
                          >
                            <ShoppingCart />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' }
                              }}
                              onClick={() => navigate(`/products/${item.productId}`)}
                            >
                              {item.product?.name || 'Unknown Product'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              SKU: {item.product?.sku || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {item.quantity}
                      </TableCell>
                      <TableCell align="right">
                        ${item.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ${item.totalPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  ${(order.totalAmount - 9.99 - order.totalAmount * 0.08).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">$9.99</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">
                  ${(order.totalAmount * 0.08).toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                ${order.totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Shipping Information */}
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Shipping Address
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {order.customer?.firstName} {order.customer?.lastName}<br />
              {order.shippingAddress}<br />
              {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}<br />
              {order.shippingCountry}
            </Typography>

            {order.notes && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Order Notes
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {order.notes}
                </Typography>
              </>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default OrderDetails
