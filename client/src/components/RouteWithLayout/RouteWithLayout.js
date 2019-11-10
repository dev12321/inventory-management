import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import * as userActions from "./../../reducerActions/users";
class RouteWithLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false
    };
  }
  componentWillMount() {
    if (this.props.authRequired && !this.props.currentUser.email) {
      const token = localStorage.getItem("IToken");
      if (token) {
        const decodedToken = jwt_decode(token);
        if (decodedToken && decodedToken.username) {
          this.setState({ isAuth: true });
        }
        this.props.loadUser({ ...decodedToken, email: decodedToken.username });
      }
    } else {
      this.setState({ isAuth: true });
    }
  }

  render() {
    const {
      layout: Layout,
      component: Component,
      authRequired,
      loadUser,
      currentUser,
      ...rest
    } = this.props;
    // console.log(!authRequired, this.state.isAuth);
    return (
      <Route
        {...rest}
        render={matchProps =>
          !authRequired || this.state.isAuth ? (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          ) : (
            <Redirect to="/sign-in" />
          )
        }
      />
    );
  }
}

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

const mapStateToProps = state => {
  return {
    currentUser: state.common.currentUser
  };
};

const mapDispachToProps = (dispatch, props) => ({
  loadUser: user => {
    dispatch(userActions.loadUser(user));
  }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(RouteWithLayout);
