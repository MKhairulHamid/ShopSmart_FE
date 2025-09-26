import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material'
import {
  Dashboard,
  Inventory,
  Category,
  ShoppingCart,
  People,
  TrendingUp,
  AttachMoney,
  LocalShipping,
  Warning,
} from '@mui/icons-material'
import { productApi, categoryApi, orderApi } from '../../services/api'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()

  // Fetch dashboard data
  const { data: products = [] } = useQuery('products', () => productApi.getProducts())
  const { data: categories = [] } = useQuery('categories', categoryApi.getCategories)
  const { data: orders = [] } = useQuery('orders', () => orderApi.getOrders())
  const { data: lowStockProducts = [] } = useQuery('low-stock', () => productApi.getLowStockProducts(10))

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const pendingOrders = orders.filter(order => order.status === 0).length // Pending status

  const dashboardCards = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Inventory fontSize="large" />,
      color: 'primary.main',
      action: () => navigate('/admin/products'),
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: <Category fontSize="large" />,
      color: 'secondary.main',
      action: () => navigate('/admin/categories'),
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingCart fontSize="large" />,
      color: 'success.main',
      action: () => navigate('/admin/orders'),
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <AttachMoney fontSize="large" />,
      color: 'warning.main',
      action: () => navigate('/admin/orders'),
    },
  ]

  const quickActions = [
    {
      title: 'Manage Products',
      description: 'Add, edit, and manage product inventory',
      icon: <Inventory />,
      action: () => navigate('/admin/products'),
    },
    {
      title: 'Manage Categories',
      description: 'Organize products into categories',
      icon: <Category />,
      action: () => navigate('/admin/categories'),
    },
    {
      title: 'View Orders',
      description: 'Process and fulfill customer orders',
      icon: <ShoppingCart />,
      action: () => navigate('/admin/orders'),
    },
    {
      title: 'Customer Management',
      description: 'View and manage customer accounts',
      icon: <People />,
      action: () => navigate('/admin/customers'),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your e-commerce platform
        </Typography>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={card.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            <List>
              {quickActions.map((action, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    onClick={action.action}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      {action.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={action.title}
                      secondary={action.description}
                    />
                  </ListItem>
                  {index < quickActions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Alerts & Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Alerts & Notifications
            </Typography>
            
            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning color="warning" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Low Stock Alert
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {lowStockProducts.length} products are running low on stock
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/products?filter=low-stock')}
                >
                  View Products
                </Button>
              </Box>
            )}

            {/* Pending Orders */}
            {pendingOrders > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShipping color="info" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Pending Orders
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pendingOrders} orders are waiting to be processed
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/orders?status=pending')}
                >
                  Process Orders
                </Button>
              </Box>
            )}

            {/* Recent Activity Placeholder */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent activity will be displayed here, such as new orders, product updates, and customer registrations.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* System Status */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              System Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Online
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    System Status
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {products.filter(p => p.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Products
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {products.filter(p => !p.isInStock).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Out of Stock
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {orders.filter(o => o.status === 2).length} {/* Shipped status */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders Shipped
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminDashboard
