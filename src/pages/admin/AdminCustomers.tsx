import React from 'react'
import {
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Button,
  Grid,
} from '@mui/material'
import {
  People,
  PersonAdd,
  Email,
} from '@mui/icons-material'

const AdminCustomers: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Customer Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage customer accounts and communications
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <People sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This admin panel would allow you to manage customer accounts, view customer 
              information, and handle customer service operations.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo frontend. In a real application, this page would include:
              <ul style={{ textAlign: 'left', marginTop: '8px', marginBottom: '8px' }}>
                <li>Customer listing with search and filters</li>
                <li>Customer profile management</li>
                <li>Order history for each customer</li>
                <li>Customer support ticket system</li>
                <li>Email marketing and newsletters</li>
                <li>Customer segmentation and analytics</li>
                <li>Account verification and management</li>
              </ul>
            </Alert>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{ mr: 2 }}
            >
              Add Customer
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
            >
              Send Newsletter
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminCustomers
