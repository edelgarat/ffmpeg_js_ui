import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { blue, indigo } from "@material-ui/core/colors";

import "./styles/clear.css";
import "./styles/App.css";

import Main from "./Main";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900],
    },
    primary: {
      main: indigo[700],
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
};

export default App;
