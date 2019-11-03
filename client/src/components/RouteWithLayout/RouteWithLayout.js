import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import * as loadingActions from "./../Loading/actions";
class RouteWithLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false
    };
  }
  componentWillMount() {
    this.props.showLoading();
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken && decodedToken.email) {
        this.setState({ isAuth: true });
      }
    }
    this.props.hideLoading();
  }

  render() {
    const {
      layout: Layout,
      component: Component,
      authRequired,
      ...rest
    } = this.props;
    console.log(!authRequired, this.state.isAuth);
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
  // console.log("YOO STATE in Overview")
  // console.log(state);
  // console.log(state.firebase.profile);
  return {
    currentUser: state.common.currentUser,
    loading: state.common.loading
  };
};

const mapDispachToProps = (dispatch, props) => ({
  showLoading: () => {
    dispatch(loadingActions.showLoading());
  },
  hideLoading: () => {
    dispatch(loadingActions.hideLoading());
  }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(RouteWithLayout);
