import { createTheme } from "@mui/material";

const appTheme = createTheme({
  palette: {
    primary: {
      main: '#ededed',
    },
    success: {
      main: '#d6fff4',
      contrastText: '#00c890',
    },
    info: {
      main: '#fff5e1',
      contrastText: '#ffb52c',
    },
    error: {
      main: '#ffe4e4',
      contrastText: '#af0202',
    },
  },
})

export default appTheme