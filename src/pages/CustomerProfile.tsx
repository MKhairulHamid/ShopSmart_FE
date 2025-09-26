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
  Avatar,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
} from '@mui/material'
import {
  Person,
  Edit,
  Save,
  Cancel,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material'
import { useCustomer } from '../context/CustomerContext'
import { Customer } from '../types'

interface ProfileForm {
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

const CustomerProfile: React.FC = () => {
  const navigate = useNavigate()
  const { customer, isAuthenticated, updateProfile, isLoading } = useCustomer()
  const [isEditing, setIsEditing] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register?redirect=profile')
    }
  }, [isAuthenticated, navigate])

  const form = useForm<ProfileForm>({
    defaultValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phoneNumber: customer?.phoneNumber || '',
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      postalCode: customer?.postalCode || '',
      country: customer?.country || '',
    },
  })

  // Reset form when customer data changes
  React.useEffect(() => {
    if (customer) {
      form.reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        postalCode: customer.postalCode || '',
        country: customer.country || '',
      })
    }
  }, [customer, form])

  const onSubmit = async (data: ProfileForm) => {
    try {
      setUpdateError(null)
      setUpdateSuccess(false)
      
      await updateProfile(data)
      setIsEditing(false)
      setUpdateSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    form.reset()
    setIsEditing(false)
    setUpdateError(null)
  }

  if (!isAuthenticated || !customer) {
    return null // Will redirect via useEffect
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information
        </Typography>
      </Box>

      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      {updateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {updateError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                {customer.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Member since {new Date(customer.createdAt).toLocaleDateString()}
              </Typography>
              <Button
                variant={isEditing ? 'outlined' : 'contained'}
                startIcon={isEditing ? <Cancel /> : <Edit />}
                onClick={() => {
                  if (isEditing) {
                    handleCancel()
                  } else {
                    setIsEditing(true)
                  }
                }}
                fullWidth
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Account Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Orders:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {customer.orders?.length || 0}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/orders')}
                sx={{ mt: 2 }}
              >
                View Order History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Personal Information
              </Typography>
              {isEditing && (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </Box>

            <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Basic Information
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={form.control}
                    rules={{ required: 'First name is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="First Name"
                        error={!!error}
                        helperText={error?.message}
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lastName"
                    control={form.control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        error={!!error}
                        helperText={error?.message}
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
                    <Email sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Contact Information
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={form.control}
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
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        type="tel"
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                {/* Address Information */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Address Information
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Street Address"
                        multiline
                        rows={2}
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="State/Province"
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="postalCode"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Postal Code"
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Country"
                        disabled={!isEditing}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CustomerProfile
