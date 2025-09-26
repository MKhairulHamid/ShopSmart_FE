import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material'
import { useCustomer } from '../context/CustomerContext'
import { Customer } from '../types'

interface LoginForm {
  email: string
}

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const CustomerRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, isLoading, error, clearError } = useCustomer()
  
  const [currentTab, setCurrentTab] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [registerError, setRegisterError] = useState<string | null>(null)

  const redirectPath = searchParams.get('redirect') || '/'

  const loginForm = useForm<LoginForm>({
    defaultValues: {
      email: '',
    },
  })

  const registerForm = useForm<RegisterForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    },
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
    clearError()
    setLoginError(null)
    setRegisterError(null)
  }

  const onLoginSubmit = async (data: LoginForm) => {
    try {
      setLoginError(null)
      clearError()
      await login(data.email)
      
      // Redirect after successful login
      if (redirectPath === 'checkout') {
        navigate('/checkout')
      } else {
        navigate(redirectPath)
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const onRegisterSubmit = async (data: RegisterForm) => {
    try {
      setRegisterError(null)
      clearError()
      
      const customerData: Omit<Customer, 'id' | 'createdAt' | 'orders' | 'fullName'> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        postalCode: data.postalCode || undefined,
        country: data.country || undefined,
      }
      
      await register(customerData)
      
      // Redirect after successful registration
      if (redirectPath === 'checkout') {
        navigate('/checkout')
      } else {
        navigate(redirectPath)
      }
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to ShopSmart
          </Typography>
          <Typography variant="body1">
            {redirectPath === 'checkout' 
              ? 'Please login or create an account to continue with checkout'
              : 'Login to your account or create a new one to get started'
            }
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 4 }}
          >
            <Tab label="Login" />
            <Tab label="Create Account" />
          </Tabs>

          {/* Login Tab */}
          <TabPanel value={currentTab} index={0}>
            <Box component="form" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Login to Your Account
              </Typography>

              {(loginError || error) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {loginError || error}
                </Alert>
              )}

              <Controller
                name="email"
                control={loginForm.control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ py: 1.5, mb: 2 }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Note: This is a demo. Simply enter any email address to find or create a customer account.
              </Typography>
            </Box>
          </TabPanel>

          {/* Register Tab */}
          <TabPanel value={currentTab} index={1}>
            <Box component="form" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Create New Account
              </Typography>

              {(registerError || error) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {registerError || error}
                </Alert>
              )}

              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    Personal Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={registerForm.control}
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
                    name="lastName"
                    control={registerForm.control}
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

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={registerForm.control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        type="email"
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phoneNumber"
                    control={registerForm.control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number (Optional)"
                        type="tel"
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Address Information */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1 }} />
                    Address Information (Optional)
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={registerForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Street Address"
                        multiline
                        rows={2}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="city"
                    control={registerForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="state"
                    control={registerForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="State/Province"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="postalCode"
                    control={registerForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Postal Code"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="country"
                    control={registerForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Country"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{ py: 1.5, mt: 2 }}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              By continuing, you agree to our{' '}
              <MuiLink href="/terms" target="_blank">
                Terms of Service
              </MuiLink>{' '}
              and{' '}
              <MuiLink href="/privacy" target="_blank">
                Privacy Policy
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default CustomerRegistration
