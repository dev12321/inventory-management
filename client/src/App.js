import React, { Component } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
// import { Chart } from "react-chartjs-2";
import { ThemeProvider } from "@material-ui/styles";
import validate from "validate.js";
import { Provider } from "react-redux";
import configureStore from "./store";

// import { chartjs } from "./helpers";
import theme from "./theme";
// import "react-perfect-scrollbar/dist/css/styles.css";
// import "./assets/scss/index.scss";
// import validators from "./common/validators";
import Routes from "./routes";
import Loading from "./components/Loading";

const browserHistory = createBrowserHistory();

// Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
//   draw: chartjs.draw
// });

// validate.validators = {
//   ...validate.validators,
//   ...validators
// };

export default class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <ThemeProvider theme={theme}>
          <Router history={browserHistory}>
            <Loading />
            <Routes />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}
