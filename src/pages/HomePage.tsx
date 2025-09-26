import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  ShoppingCart,
  Star,
  TrendingUp,
  LocalShipping,
  Security,
  Support,
  ArrowForward,
} from '@mui/icons-material'
import { productApi, categoryApi } from '../services/api'
import { useCart } from '../context/CartContext'

const HomePage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { addItem } = useCart()

  // Fetch featured products (latest 6 products)
  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery(
    'featured-products',
    () => productApi.getProducts({ inStockOnly: true }),
    {
      select: (data) => data.slice(0, 6),
    }
  )

  // Fetch categories for quick navigation
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    'categories',
    categoryApi.getCategories
  )

  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Customer support around the clock',
    },
  ]

  const handleAddToCart = (productId: number) => {
    const product = featuredProducts.find(p => p.id === productId)
    if (product) {
      addItem(product, 1)
    }
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Welcome to ShopSmart
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Discover amazing products at unbeatable prices
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
            endIcon={<ArrowForward />}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    backgroundColor: 'white',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}
          >
            Shop by Category
          </Typography>
          <Grid container spacing={3}>
            {categories.slice(0, 8).map((category) => (
              <Grid item xs={6} sm={4} md={3} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/category/${category.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="body2" color="text.secondary">
                        {category.description.length > 50
                          ? `${category.description.substring(0, 50)}...`
                          : category.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
            >
              View All Categories
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              Featured Products
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
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
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleAddToCart(product.id)}
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
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Stay Updated
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Subscribe to our newsletter for the latest deals and product updates
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              gap: 2,
              maxWidth: 400,
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
            onSubmit={(e) => {
              e.preventDefault()
              // Newsletter subscription logic would go here
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
