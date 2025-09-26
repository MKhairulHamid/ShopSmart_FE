import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Box,
  Menu,
  MenuItem,
  InputBase,
  alpha,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  ShoppingCart,
  Search as SearchIcon,
  AccountCircle,
  Menu as MenuIcon,
  Home,
  Category,
  Person,
  History,
  AdminPanelSettings,
  Logout,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useCart } from '../../context/CartContext'
import { useCustomer } from '../../context/CustomerContext'

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}))

const Header: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  
  const { totalItems, openCart } = useCart()
  const { customer, isAuthenticated, logout } = useCustomer()
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate('/')
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Products', icon: <Category />, path: '/products' },
    ...(isAuthenticated ? [
      { text: 'Profile', icon: <Person />, path: '/profile' },
      { text: 'Order History', icon: <History />, path: '/orders' },
    ] : []),
  ]

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {isAuthenticated ? (
        [
          <MenuItem key="profile" onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            <Person sx={{ mr: 1 }} />
            Profile
          </MenuItem>,
          <MenuItem key="orders" onClick={() => { navigate('/orders'); handleMenuClose(); }}>
            <History sx={{ mr: 1 }} />
            Order History
          </MenuItem>,
          <Divider key="divider" />,
          <MenuItem key="admin" onClick={() => { navigate('/admin'); handleMenuClose(); }}>
            <AdminPanelSettings sx={{ mr: 1 }} />
            Admin Panel
          </MenuItem>,
          <MenuItem key="logout" onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            Logout
          </MenuItem>,
        ]
      ) : (
        <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }}>
          <Person sx={{ mr: 1 }} />
          Login / Register
        </MenuItem>
      )}
    </Menu>
  )

  const mobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">
            ShopSmart
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => { navigate(item.path); toggleMobileMenu(); }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        {isAuthenticated && (
          <>
            <Divider />
            <List>
              <ListItem button onClick={() => { navigate('/admin'); toggleMobileMenu(); }}>
                <ListItemIcon><AdminPanelSettings /></ListItemIcon>
                <ListItemText primary="Admin Panel" />
              </ListItem>
              <ListItem button onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Divider />
            <List>
              <ListItem button onClick={() => { navigate('/register'); toggleMobileMenu(); }}>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Login / Register" />
              </ListItem>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  )

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              mr: 4,
            }}
          >
            ShopSmart
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                sx={{ mr: 2 }}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/products"
                sx={{ mr: 2 }}
              >
                Products
              </Button>
            </Box>
          )}

          <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1 }}>
            <SearchWrapper>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchWrapper>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={openCart}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
        
        {isAuthenticated && (
          <Box sx={{ backgroundColor: 'primary.dark', py: 0.5, px: 2 }}>
            <Typography variant="body2" color="inherit">
              Welcome back, {customer?.firstName}!
            </Typography>
          </Box>
        )}
      </AppBar>
      
      {profileMenu}
      {mobileMenu}
    </>
  )
}

export default Header
