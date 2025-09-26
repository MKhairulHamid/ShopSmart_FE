import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material'
import { categoryApi, productApi } from '../services/api'
import ProductCatalog from './ProductCatalog'

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  
  const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : 0

  // Fetch category details
  const { 
    data: category, 
    isLoading: categoryLoading, 
    error: categoryError 
  } = useQuery(
    ['category', categoryIdNumber],
    () => categoryApi.getCategory(categoryIdNumber),
    {
      enabled: !!categoryIdNumber,
    }
  )

  if (categoryLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (categoryError || !category) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Category not found or failed to load.
        </Alert>
      </Container>
    )
  }

  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            onClick={() => navigate('/products')}
            sx={{ textDecoration: 'none' }}
          >
            Products
          </MuiLink>
          <Typography color="text.primary" variant="body2">
            {category.name}
          </Typography>
        </Breadcrumbs>

        {/* Category Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {category.name}
          </Typography>
          {category.description && (
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {category.description}
            </Typography>
          )}
        </Box>
      </Container>

      {/* Use ProductCatalog component with category filter */}
      <ProductCatalog />
    </Box>
  )
}

export default CategoryPage
