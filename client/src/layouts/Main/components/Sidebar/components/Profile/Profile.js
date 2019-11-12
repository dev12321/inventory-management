import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { BrandingWatermark } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content"
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const user = {
    fullName: props.currentUser.fullName,
    avatar: "/images/avatars/avatar_11.png"
  };

  switch (props.currentUser.role) {
    case 0:
      user.role = "User";
      break;
    case 1:
      user.role = "Admin";
      break;
    case 2:
      user.role = "Super Admin";
      break;
    default:
      user.role = "UNKNOWN";
  }
  return (
    <div className={clsx(classes.root, className)}>
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={"/images/avatars/avatar_11.png"}
        to="/profile"
      >
        {/* {user.fullName[0]} */}D
      </Avatar>
      <Typography className={classes.name} variant="h4">
        {user.fullName}
      </Typography>
      <Typography variant="body2">{user.role}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = state => {
  return {
    currentUser: state.common.currentUser
  };
};

// const mapDispachToProps = (dispatch, props) => ({
//   showLoading: () => {
//     dispatch(loadingActions.showLoading());
//   },
//   hideLoading: () => {
//     dispatch(loadingActions.hideLoading());
//   },
//   loadCurrentUser: user => {
//     dispatch(actions.loadUser(user));
//   }
// });

export default connect(mapStateToProps, null)(Profile);
