import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    border: {
      main: '#a6b7ff',
    },
    link: {
      main: '#6945f8',
    },
    linkHover: {
      main: '#7367ff',
    },
    footer: {
      main: '#1976d205',
    },
    background: {
      default: '#f0f4f6',
    },
    primary: {
      main: '#45379e', //
    },
    success: {
      main: '#6945f8', //
      contrastText: '#ffffff', // custom button text (white)
    },
    error: {
      main: '#ff3864', // custom button color (red)
    },
  },
  typography: {
    fontFamily: ['Work Sans', 'Work Sans'].join(','),
  },
  transitions: {
    easing: {
      // This is the most common easing curve.
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Objects enter the screen at full velocity from off-screen and
      // slowly decelerate to a resting point.
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      // Objects leave the screen at full velocity. They do not decelerate when off-screen.
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      // The sharp curve is used by objects that may return to the screen at any time.
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
})

export default lightTheme;
