import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Rating,
  Paper,
} from '@mui/material'
import {
  ShoppingCart,
  Add,
  Remove,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  ArrowBack,
  Star,
} from '@mui/icons-material'
import { productApi } from '../services/api'
import { useCart } from '../context/CartContext'

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
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const productId = id ? parseInt(id, 10) : 0

  // Fetch product details
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery(
    ['product', productId],
    () => productApi.getProduct(productId),
    {
      enabled: !!productId,
    }
  )

  // Fetch related products (same category)
  const { data: relatedProducts = [] } = useQuery(
    ['related-products', product?.categoryId],
    () => productApi.getProducts({ 
      categoryId: product?.categoryId,
      inStockOnly: true 
    }),
    {
      enabled: !!product?.categoryId,
      select: (data) => data.filter(p => p.id !== productId).slice(0, 4),
    }
  )

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 0)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      // Show success message or animation here
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity)
      navigate('/cart')
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // In a real app, this would save to user's favorites
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Product not found or failed to load.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        {product.category && (
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate(`/category/${product.categoryId}`)}
            sx={{ textDecoration: 'none' }}
          >
            {product.category.name}
          </MuiLink>
        )}
        <Typography color="text.primary" variant="body2">
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
            <CardMedia
              component="div"
              sx={{
                height: 400,
                backgroundColor: 'grey.100',
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
                <ShoppingCart sx={{ fontSize: 100, color: 'grey.400' }} />
              )}
              {!product.isInStock && (
                <Chip
                  label="Out of Stock"
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                  }}
                />
              )}
            </CardMedia>
          </Card>
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                (24 reviews)
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
              }}
            >
              ${product.price.toFixed(2)}
            </Typography>

            {product.description && (
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {product.description}
              </Typography>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                SKU: {product.sku || 'N/A'}
              </Typography>
              <Typography
                variant="body2"
                color={product.isInStock ? 'success.main' : 'error.main'}
                gutterBottom
              >
                {product.isInStock 
                  ? `${product.stockQuantity} in stock` 
                  : 'Out of stock'
                }
              </Typography>
              {product.category && (
                <Typography variant="body2" color="text.secondary">
                  Category: {product.category.name}
                </Typography>
              )}
            </Box>

            {product.isInStock && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    size="small"
                  >
                    <Remove />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val) && val >= 1 && val <= product.stockQuantity) {
                        setQuantity(val)
                      }
                    }}
                    sx={{ width: 80 }}
                    size="small"
                    inputProps={{ 
                      style: { textAlign: 'center' },
                      min: 1,
                      max: product.stockQuantity,
                    }}
                  />
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                disabled={!product.isInStock}
                startIcon={<ShoppingCart />}
                sx={{ py: 1.5 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleBuyNow}
                disabled={!product.isInStock}
                sx={{ py: 1.5, minWidth: 120 }}
              >
                Buy Now
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <IconButton onClick={toggleFavorite} color="secondary">
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Features */}
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
                  Secure payment & 30-day return policy
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
            <Tab label="Shipping & Returns" />
          </Tabs>

          <TabPanel value={selectedTab} index={0}>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {product.description || 'No detailed description available.'}
            </Typography>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">SKU:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{product.sku || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Category:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{product.category?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Stock Quantity:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{product.stockQuantity}</Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                4.5 out of 5 (24 reviews)
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Customer reviews will be displayed here.
            </Typography>
          </TabPanel>

          <TabPanel value={selectedTab} index={3}>
            <Typography variant="h6" gutterBottom>Shipping Information</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Free shipping on orders over $50<br />
              • Standard delivery: 3-5 business days<br />
              • Express delivery: 1-2 business days (additional charge)
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Return Policy
            </Typography>
            <Typography variant="body2">
              • 30-day return policy<br />
              • Items must be in original condition<br />
              • Free returns for defective items
            </Typography>
          </TabPanel>
        </Paper>
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 150,
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {relatedProduct.imageUrl ? (
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <ShoppingCart sx={{ fontSize: 40, color: 'grey.400' }} />
                    )}
                  </CardMedia>
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {relatedProduct.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mt: 1,
                      }}
                    >
                      ${relatedProduct.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  )
}

export default ProductDetails
