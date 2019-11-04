import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  AppBar,
  Toolbar,
  Badge,
  Hidden,
  IconButton,
  Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import { connect } from "react-redux";
import * as userActions from "./../../../../reducerActions/users";
import * as loadingActions from "./../../../../reducerActions/loading";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: "none"
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);

  const handleSignOut = () => {
    props.showLoading();
    localStorage.clear();
    // console.log(props);
    props.history.push("/sign-in");
    props.loadUser({});
    props.hideLoading();
  };

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/">
          {/* <img
            alt="Logo"
            src="/images/logos/logo--white.svg"
          /> */}
          <Typography
            style={{ color: "white", fontFamily: "cursive" }}
            variant="h3"
          >
            INVENTORY
          </Typography>
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={handleSignOut}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
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
  },
  loadUser: user => {
    dispatch(userActions.loadUser(user));
  }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(Topbar);
