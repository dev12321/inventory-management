import React, { Component } from "react";
import { Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { RouteWithLayout } from "../components";
import { Main as MainLayout, Minimal as MinimalLayout } from "../layouts";
import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  //   UserList as UserListView,
  //   Typography as TypographyView,
  //   Icons as IconsView,
  //   Account as AccountView,
  ShipmentList as ShipmentListView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  ForgotPassword as ForgotPasswordView
} from "../views";

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/dashboard" />

      <RouteWithLayout
        authRequired={true}
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />

      <RouteWithLayout
        authRequired={true}
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        authRequired={true}
        component={ShipmentListView}
        exact
        layout={MainLayout}
        path="/shipments"
      />
      {/* <RouteWithLayout
        authRequired={false}
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      /><RouteWithLayout
        authRequired={false}
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        authRequired={false}
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        authRequired={false}
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        authRequired={false}
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      /> */}
      <RouteWithLayout
        authRequired={false}
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        authRequired={false}
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        authRequired={false}
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <RouteWithLayout
        authRequired={false}
        component={ForgotPasswordView}
        exact
        layout={MinimalLayout}
        path="/forgot-password"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
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

// const mapDispachToProps = (dispatch, props) => ({
//   loadassessmentProfile: assessmentProfile => {
//     dispatch(loginActions.loadassessmentProfile(assessmentProfile));
//   }
// });

export default connect(
  mapStateToProps,
  null
)(Routes);
