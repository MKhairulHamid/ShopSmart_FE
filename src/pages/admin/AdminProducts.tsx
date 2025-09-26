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
  Add,
  Inventory,
} from '@mui/icons-material'

const AdminProducts: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Product Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your product inventory
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Inventory sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Product Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This admin panel would allow you to manage products, including adding new products, 
              editing existing ones, managing inventory, and setting prices.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo frontend. In a real application, this page would include:
              <ul style={{ textAlign: 'left', marginTop: '8px', marginBottom: '8px' }}>
                <li>Product listing with search and filters</li>
                <li>Add/Edit product forms</li>
                <li>Bulk operations (import/export)</li>
                <li>Inventory tracking</li>
                <li>Image management</li>
                <li>SEO optimization tools</li>
              </ul>
            </Alert>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ mr: 2 }}
            >
              Add New Product
            </Button>
            <Button variant="outlined">
              Import Products
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminProducts
