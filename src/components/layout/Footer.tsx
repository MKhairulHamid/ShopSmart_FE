import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material'
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material'

const Footer: React.FC = () => {
  const theme = useTheme()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    shop: [
      { name: 'All Products', path: '/products' },
      { name: 'Categories', path: '/products' },
      { name: 'New Arrivals', path: '/products?new=true' },
      { name: 'Sale Items', path: '/products?sale=true' },
    ],
    account: [
      { name: 'My Account', path: '/profile' },
      { name: 'Order History', path: '/orders' },
      { name: 'Shopping Cart', path: '/cart' },
      { name: 'Register', path: '/register' },
    ],
    support: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping Info', path: '/shipping' },
      { name: 'Returns', path: '/returns' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <Twitter />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <Instagram />, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: <LinkedIn />, url: 'https://linkedin.com' },
  ]

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ShopSmart
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.300' }}>
              Your one-stop destination for smart shopping. We offer quality products 
              at competitive prices with excellent customer service.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="grey.300">
                123 Shopping Street, Commerce City, CC 12345
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="grey.300">
                (555) 123-4567
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="grey.300">
                support@shopmart.com
              </Typography>
            </Box>
            <Box>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'grey.300',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Shop Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Shop
            </Typography>
            {footerLinks.shop.map((link) => (
              <MuiLink
                key={link.name}
                component={Link}
                to={link.path}
                sx={{
                  display: 'block',
                  color: 'grey.300',
                  textDecoration: 'none',
                  py: 0.5,
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.name}
              </MuiLink>
            ))}
          </Grid>

          {/* Account Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Account
            </Typography>
            {footerLinks.account.map((link) => (
              <MuiLink
                key={link.name}
                component={Link}
                to={link.path}
                sx={{
                  display: 'block',
                  color: 'grey.300',
                  textDecoration: 'none',
                  py: 0.5,
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.name}
              </MuiLink>
            ))}
          </Grid>

          {/* Support Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Support
            </Typography>
            {footerLinks.support.map((link) => (
              <MuiLink
                key={link.name}
                component={Link}
                to={link.path}
                sx={{
                  display: 'block',
                  color: 'grey.300',
                  textDecoration: 'none',
                  py: 0.5,
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.name}
              </MuiLink>
            ))}
          </Grid>

          {/* Company Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Company
            </Typography>
            {footerLinks.company.map((link) => (
              <MuiLink
                key={link.name}
                component={Link}
                to={link.path}
                sx={{
                  display: 'block',
                  color: 'grey.300',
                  textDecoration: 'none',
                  py: 0.5,
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.name}
              </MuiLink>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'grey.700' }} />

        {/* Bottom section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="grey.400">
            © {currentYear} ShopSmart. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
            <MuiLink
              component={Link}
              to="/privacy"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              to="/terms"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              component={Link}
              to="/cookies"
              sx={{
                color: 'grey.400',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Cookie Policy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
