import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1b6535',
      contrastText: '#fff',
    },
    secondary: {
      main: "#e6b644"
    },
    background: {
      default: "#ede9d2"
    },
    text: {
      disabled: ""
    }
  },
});

export default theme;
