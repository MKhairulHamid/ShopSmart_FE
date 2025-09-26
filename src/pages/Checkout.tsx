import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material'
import {
  ShoppingCart,
  CreditCard,
  LocalShipping,
  CheckCircle,
  Lock,
} from '@mui/icons-material'
import { useCart } from '../context/CartContext'
import { useCustomer } from '../context/CustomerContext'
import { orderApi } from '../services/api'
import { CreateOrderRequest, ShippingAddress } from '../types'

interface CheckoutForm {
  // Shipping Address
  shippingFirstName: string
  shippingLastName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  
  // Billing Address
  sameAsShipping: boolean
  billingFirstName?: string
  billingLastName?: string
  billingAddress?: string
  billingCity?: string
  billingState?: string
  billingPostalCode?: string
  billingCountry?: string
  
  // Payment
  paymentMethod: 'credit' | 'debit' | 'paypal'
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardName?: string
}

const steps = ['Shipping', 'Payment', 'Review']

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { items, totalAmount, clearCart } = useCart()
  const { customer, isAuthenticated } = useCustomer()
  
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  const form = useForm<CheckoutForm>({
    defaultValues: {
      shippingFirstName: customer?.firstName || '',
      shippingLastName: customer?.lastName || '',
      shippingAddress: customer?.address || '',
      shippingCity: customer?.city || '',
      shippingState: customer?.state || '',
      shippingPostalCode: customer?.postalCode || '',
      shippingCountry: customer?.country || 'United States',
      sameAsShipping: true,
      paymentMethod: 'credit',
    },
  })

  const watchSameAsShipping = form.watch('sameAsShipping')

  // Redirect if not authenticated or no items
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register?redirect=checkout')
      return
    }
    if (items.length === 0) {
      navigate('/cart')
      return
    }
  }, [isAuthenticated, items.length, navigate])

  const calculateShipping = () => {
    return totalAmount >= 50 ? 0 : 9.99
  }

  const calculateTax = () => {
    return totalAmount * 0.08 // 8% tax
  }

  const shipping = calculateShipping()
  const tax = calculateTax()
  const finalTotal = totalAmount + shipping + tax

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Submit order
      await handleSubmitOrder()
    } else {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleSubmitOrder = async () => {
    if (!customer) return

    setIsSubmitting(true)
    setOrderError(null)

    try {
      const formData = form.getValues()
      
      const shippingAddress: ShippingAddress = {
        address: formData.shippingAddress,
        city: formData.shippingCity,
        state: formData.shippingState,
        postalCode: formData.shippingPostalCode,
        country: formData.shippingCountry,
      }

      const orderRequest: CreateOrderRequest = {
        customerId: customer.id,
        cartItems: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
      }

      const order = await orderApi.createOrder(orderRequest)
      
      // Clear cart and redirect to success page
      clearCart()
      navigate(`/orders/${order.id}?success=true`)
      
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Failed to create order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderShippingStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Shipping Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="shippingFirstName"
            control={form.control}
            rules={{ required: 'First name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="First Name"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="shippingLastName"
            control={form.control}
            rules={{ required: 'Last name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Last Name"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="shippingAddress"
            control={form.control}
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Address"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="shippingCity"
            control={form.control}
            rules={{ required: 'City is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="City"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Controller
            name="shippingState"
            control={form.control}
            rules={{ required: 'State is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="State"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Controller
            name="shippingPostalCode"
            control={form.control}
            rules={{ required: 'Postal code is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Postal Code"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="shippingCountry"
            control={form.control}
            rules={{ required: 'Country is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="Country"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Paper>
  )

  const renderPaymentStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Information
      </Typography>
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Payment Method</FormLabel>
        <Controller
          name="paymentMethod"
          control={form.control}
          render={({ field }) => (
            <RadioGroup {...field} row>
              <FormControlLabel value="credit" control={<Radio />} label="Credit Card" />
              <FormControlLabel value="debit" control={<Radio />} label="Debit Card" />
              <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
            </RadioGroup>
          )}
        />
      </FormControl>

      {(form.watch('paymentMethod') === 'credit' || form.watch('paymentMethod') === 'debit') && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="cardName"
              control={form.control}
              rules={{ required: 'Cardholder name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Cardholder Name"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="cardNumber"
              control={form.control}
              rules={{ required: 'Card number is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="expiryDate"
              control={form.control}
              rules={{ required: 'Expiry date is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Expiry Date"
                  placeholder="MM/YY"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="cvv"
              control={form.control}
              rules={{ required: 'CVV is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="CVV"
                  placeholder="123"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      )}

      {form.watch('paymentMethod') === 'paypal' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          You will be redirected to PayPal to complete your payment.
        </Alert>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Lock sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Secure Payment
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Your payment information is encrypted and secure. We never store your credit card details.
        </Typography>
      </Box>
    </Paper>
  )

  const renderReviewStep = () => {
    const formData = form.getValues()
    
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Review Your Order
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Order Items
            </Typography>
            
            <List>
              {items.map((item) => (
                <ListItem key={item.productId} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.product.imageUrl}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    >
                      <ShoppingCart />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Quantity: ${item.quantity} × $${item.product.price.toFixed(2)}`}
                    sx={{ ml: 2 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ${item.totalPrice.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Shipping Address
            </Typography>
            <Typography variant="body2">
              {formData.shippingFirstName} {formData.shippingLastName}<br />
              {formData.shippingAddress}<br />
              {formData.shippingCity}, {formData.shippingState} {formData.shippingPostalCode}<br />
              {formData.shippingCountry}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              Payment Method
            </Typography>
            <Typography variant="body2">
              {formData.paymentMethod === 'credit' && 'Credit Card'}
              {formData.paymentMethod === 'debit' && 'Debit Card'}
              {formData.paymentMethod === 'paypal' && 'PayPal'}
              {formData.cardNumber && ` ending in ${formData.cardNumber.slice(-4)}`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    )
  }

  if (!isAuthenticated || items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Checkout
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {orderError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {orderError}
            </Alert>
          )}

          <Box component="form">
            {activeStep === 0 && renderShippingStep()}
            {activeStep === 1 && renderPaymentStep()}
            {activeStep === 2 && renderReviewStep()}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Processing...' 
                : activeStep === steps.length - 1 
                ? 'Place Order' 
                : 'Next'
              }
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">${totalAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">${tax.toFixed(2)}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>

              {shipping === 0 && (
                <Chip
                  label="Free Shipping Applied!"
                  color="success"
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Checkout
