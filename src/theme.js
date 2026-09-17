import { createTheme } from '@mui/material/styles'

// پالت الهام‌گرفته از دفترچه یادداشت میدانی: سبز جنگل، خاکی، کرم کاغذی و قرمز آمانیتا برای تاکید
const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: { main: '#2F4B3C', light: '#4C6B57', dark: '#1D3128', contrastText: '#F3EFE4' },
    secondary: { main: '#C45A3E', light: '#D97B5F', dark: '#9C4128', contrastText: '#FFFFFF' },
    background: { default: '#F3EFE4', paper: '#FFFFFF' },
    text: { primary: '#2A2620', secondary: '#655E51' },
    divider: '#E3DCC9',
    success: { main: '#4C6B57' },
    warning: { main: '#B9862F' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Vazirmatn', 'Segoe UI', Tahoma, sans-serif",
    h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, h3: { fontWeight: 700 },
    h4: { fontWeight: 700 }, h5: { fontWeight: 700 }, h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none', boxShadow: '0 1px 0 rgba(0,0,0,0.06)' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingTop: 9, paddingBottom: 9 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500 } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E3DCC9',
          boxShadow: 'none',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid #E3DCC9',
          borderRadius: '14px !important',
          overflow: 'hidden',
          '&:before': { display: 'none' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true },
    },
    MuiFab: {
      styleOverrides: { root: { boxShadow: '0 6px 16px rgba(47,75,60,0.35)' } },
    },
  },
})

export default theme
