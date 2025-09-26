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
  Assignment,
  LocalShipping,
  Analytics,
} from '@mui/icons-material'

const AdminOrders: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Order Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Process and fulfill customer orders
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Order Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This admin panel would allow you to manage all customer orders, from processing 
              new orders to tracking shipments and handling returns.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo frontend. In a real application, this page would include:
              <ul style={{ textAlign: 'left', marginTop: '8px', marginBottom: '8px' }}>
                <li>Order listing with advanced filters and search</li>
                <li>Order status management and tracking</li>
                <li>Bulk order processing</li>
                <li>Shipping label generation</li>
                <li>Refund and return processing</li>
                <li>Order analytics and reporting</li>
                <li>Customer communication tools</li>
              </ul>
            </Alert>
            <Button
              variant="contained"
              startIcon={<LocalShipping />}
              sx={{ mr: 2 }}
            >
              Process Orders
            </Button>
            <Button
              variant="outlined"
              startIcon={<Analytics />}
            >
              View Reports
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminOrders
