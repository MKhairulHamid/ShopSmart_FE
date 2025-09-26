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
  Category,
} from '@mui/icons-material'

const AdminCategories: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Category Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Organize your products into categories
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Category sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Category Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This admin panel would allow you to manage product categories, including creating 
              hierarchical category structures and organizing products efficiently.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo frontend. In a real application, this page would include:
              <ul style={{ textAlign: 'left', marginTop: '8px', marginBottom: '8px' }}>
                <li>Category tree with drag-and-drop sorting</li>
                <li>Add/Edit category forms</li>
                <li>Category descriptions and SEO settings</li>
                <li>Category images and banners</li>
                <li>Product count per category</li>
                <li>Bulk category operations</li>
              </ul>
            </Alert>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ mr: 2 }}
            >
              Add New Category
            </Button>
            <Button variant="outlined">
              Reorganize Categories
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminCategories
