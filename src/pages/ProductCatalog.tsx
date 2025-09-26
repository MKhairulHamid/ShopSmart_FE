import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Paper,
  Drawer,
  useTheme,
  useMediaQuery,
  Slider,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  FilterList,
  ShoppingCart,
  Star,
  ArrowForward,
  Search,
  Clear,
} from '@mui/icons-material'
import { productApi, categoryApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { Product, ProductFilters } from '../types'

const ProductCatalog: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  // Filter states
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStockOnly: false,
  })
  
  const [sortBy, setSortBy] = useState<string>('name')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000])

  // Fetch products with filters
  const { 
    data: products = [], 
    isLoading: productsLoading, 
    error: productsError 
  } = useQuery(
    ['products', filters, sortBy],
    () => productApi.getProducts(filters),
    {
      select: (data) => {
        let sorted = [...data]
        switch (sortBy) {
          case 'price-low':
            sorted.sort((a, b) => a.price - b.price)
            break
          case 'price-high':
            sorted.sort((a, b) => b.price - a.price)
            break
          case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name))
            break
          case 'newest':
            sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          default:
            break
        }
        return sorted
      }
    }
  )

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useQuery(
    'categories',
    categoryApi.getCategories
  )

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.searchTerm) params.set('search', filters.searchTerm)
    if (filters.categoryId) params.set('categoryId', filters.categoryId.toString())
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.inStockOnly) params.set('inStockOnly', 'true')
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const range = newValue as number[]
    setPriceRange(range)
    handleFilterChange({
      minPrice: range[0] > 0 ? range[0] : undefined,
      maxPrice: range[1] < 1000 ? range[1] : undefined,
    })
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
    })
    setPriceRange([0, 1000])
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
  }

  const filterContent = (
    <Box sx={{ p: 3, width: isMobile ? '100%' : 300 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Filters
        </Typography>
        <Button
          size="small"
          onClick={clearFilters}
          startIcon={<Clear />}
        >
          Clear All
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search products"
          value={filters.searchTerm || ''}
          onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.categoryId || ''}
            label="Category"
            onChange={(e) => handleFilterChange({ 
              categoryId: e.target.value ? Number(e.target.value) : undefined 
            })}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          valueLabelFormat={(value) => `$${value}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>

      {/* In Stock Only */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={filters.inStockOnly || false}
              onChange={(e) => handleFilterChange({ inStockOnly: e.target.checked })}
            />
          }
          label="In stock only"
        />
      </Box>
    </Box>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Product Catalog
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our wide range of quality products
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Desktop Filters Sidebar */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={1} sx={{ position: 'sticky', top: 24 }}>
              {filterContent}
            </Paper>
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Toolbar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterDrawerOpen(true)}
                >
                  Filters
                </Button>
              )}
              <Typography variant="body2" color="text.secondary">
                {products.length} products found
              </Typography>
            </Box>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name A-Z</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Active Filters */}
          <Box sx={{ mb: 3 }}>
            {(filters.searchTerm || filters.categoryId || filters.minPrice || filters.maxPrice || filters.inStockOnly) && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Active filters:
                </Typography>
                {filters.searchTerm && (
                  <Chip
                    label={`Search: "${filters.searchTerm}"`}
                    onDelete={() => handleFilterChange({ searchTerm: '' })}
                    size="small"
                  />
                )}
                {filters.categoryId && (
                  <Chip
                    label={`Category: ${categories.find(c => c.id === filters.categoryId)?.name}`}
                    onDelete={() => handleFilterChange({ categoryId: undefined })}
                    size="small"
                  />
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Chip
                    label={`Price: $${filters.minPrice || 0} - $${filters.maxPrice || '∞'}`}
                    onDelete={() => handleFilterChange({ minPrice: undefined, maxPrice: undefined })}
                    size="small"
                  />
                )}
                {filters.inStockOnly && (
                  <Chip
                    label="In stock only"
                    onDelete={() => handleFilterChange({ inStockOnly: false })}
                    size="small"
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Loading State */}
          {productsLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {productsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load products. Please try again.
            </Alert>
          )}

          {/* Products Grid */}
          {!productsLoading && products.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters or search terms
              </Typography>
              <Button variant="outlined" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Box>
          )}

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} lg={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <ShoppingCart sx={{ fontSize: 60, color: 'grey.400' }} />
                    )}
                    {!product.isInStock && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                        }}
                      />
                    )}
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.5em',
                      }}
                    >
                      {product.description || 'No description available'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Star sx={{ color: 'orange', mr: 0.5, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        4.5 (24 reviews)
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stockQuantity}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isInStock}
                      startIcon={<ShoppingCart />}
                    >
                      {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    <IconButton
                      onClick={() => navigate(`/products/${product.id}`)}
                      sx={{ ml: 1 }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        {filterContent}
      </Drawer>
    </Container>
  )
}

export default ProductCatalog
