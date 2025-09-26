import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Paper,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Add,
  Remove,
  Delete,
  ShoppingCartCheckout,
  ArrowBack,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping,
  Security,
} from '@mui/icons-material'
import { useCart } from '../context/CartContext'
import { useCustomer } from '../context/CustomerContext'

const ShoppingCart: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { 
    items, 
    totalItems, 
    totalAmount, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart()
  const { isAuthenticated } = useCustomer()

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/register?redirect=checkout')
    } else {
      navigate('/checkout')
    }
  }

  const calculateShipping = () => {
    return totalAmount >= 50 ? 0 : 9.99
  }

  const shipping = calculateShipping()
  const finalTotal = totalAmount + shipping

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ textAlign: 'center', py: 8, px: 4 }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ py: 1.5, px: 4 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton
          onClick={() => navigate('/products')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Shopping Cart
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
              startIcon={<Delete />}
              size="small"
            >
              Clear Cart
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Card key={item.productId} elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="div"
                        sx={{
                          height: 120,
                          backgroundColor: 'grey.200',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }}
                          />
                        ) : (
                          <ShoppingCartIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                        )}
                      </CardMedia>
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/products/${item.product.id}`)}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.product.description && item.product.description.length > 100
                          ? `${item.product.description.substring(0, 100)}...`
                          : item.product.description || 'No description available'
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SKU: {item.product.sku || 'N/A'}
                      </Typography>
                      {!item.product.isInStock && (
                        <Chip
                          label="Out of Stock"
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Grid>

                    {/* Quantity Controls */}
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          size="small"
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10)
                            if (!isNaN(val) && val >= 0) {
                              handleQuantityChange(item.productId, val)
                            }
                          }}
                          sx={{ width: 80, mx: 1 }}
                          size="small"
                          inputProps={{ 
                            style: { textAlign: 'center' },
                            min: 0,
                            max: item.product.stockQuantity,
                          }}
                        />
                        <IconButton
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          size="small"
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', mt: 1 }}
                      >
                        Stock: {item.product.stockQuantity}
                      </Typography>
                    </Grid>

                    {/* Price and Remove */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          ${item.product.price.toFixed(2)} each
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 'bold', color: 'primary.main' }}
                        >
                          ${item.totalPrice.toFixed(2)}
                        </Typography>
                        <IconButton
                          onClick={() => removeItem(item.productId)}
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ position: 'sticky', top: 24 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Subtotal ({totalItems} items)
                  </Typography>
                  <Typography variant="body2">
                    ${totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Shipping
                  </Typography>
                  <Typography variant="body2">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                {shipping > 0 && (
                  <Alert severity="info" sx={{ mt: 2, p: 1 }}>
                    <Typography variant="body2">
                      Add ${(50 - totalAmount).toFixed(2)} more for free shipping!
                    </Typography>
                  </Alert>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                startIcon={<ShoppingCartCheckout />}
                sx={{ py: 1.5, mb: 2 }}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login & Checkout'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/products')}
                sx={{ mb: 3 }}
              >
                Continue Shopping
              </Button>

              <Divider sx={{ mb: 2 }} />

              {/* Trust Badges */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Free shipping on orders over $50
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Secure checkout & 30-day returns
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ShoppingCart
