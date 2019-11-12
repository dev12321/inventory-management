import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
  Divider
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import CustomSnackbar from "../../components/Snackbar";
import * as loadingActions from "../../reducerActions/loading";
import { connect } from "react-redux";
import * as actions from "../../reducerActions/users";
import { USER_ROLES } from "../../utils/constants";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column"
    // alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: 100,
    height: 100
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Account(props) {
  const classes = useStyles();
  const { role, username, phone, fullName } = props.currentUser;
  const [snackbarDetails, setSnackbarDetails] = useState({
    message: "",
    variant: "success",
    open: false
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarDetails({ ...snackbarDetails, open: false });
  };
  // if (props.currentUser.email) {
  //   props.history.push('/')
  // }
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      component="main"
      maxWidth="xs"
      style={{ alignItems: "center" }}
    >
      <CustomSnackbar
        onClose={handleClose}
        open={snackbarDetails.open}
        message={snackbarDetails.message}
        variant={snackbarDetails.variant}
      />
      <CssBaseline />
      <Grid item xs={4}>
        <Grid
          container
          style={{ alignItems: "center", padding: "10px" }}
          direction="column"
        >
          {/* <Grid item>
            <Avatar
              alt="Person"
              className={classes.avatar}
              src={"/images/avatars/avatar_11.png"}
              to="/profile"
            />
          </Grid> */}
          <Grid item>
            <Typography variant="h1">{fullName}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{username}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{phone}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{USER_ROLES[role]}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={2}>
        <Divider orientation="vertical" style={{ margin: "10px" }} />
      </Grid> */}
      <Grid item xs={4}>
        <Formik
          initialValues={{
            username: props.currentUser.username,
            password: ""
          }}
          onSubmit={values => {
            // props.showLoading();
            console.log(values);

            // axios
            //   .post("/api/users/login", values)
            //   .then(res => {
            //     props.hideLoading();
            //     console.log(res.data);

            //     props.loadCurrentUser(res.data.user);
            //     setSnackbarDetails({
            //       message: res.data.message,
            //       variant: "success",
            //       open: true
            //     });
            //     localStorage.setItem("IToken", res.data.token);
            //     props.history.push("/");
            //   })
            //   .catch(err => {
            //     props.hideLoading();
            //     setSnackbarDetails({
            //       message: err.response.data.message,
            //       variant: "error",
            //       open: true
            //     });
            //   });
          }}
          // validationSchema={Yup.object().shape({
          //   email: Yup.string()
          //     .email("Input must be email")
          //     .required("Email is required"),
          //   password: Yup.string()
          //     .required("Password is Required")
          //     .min(8, "Minimum Length should be 8")
          //     .max(12, "Maximum length can only be 12")
          // })}
          render={({
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            handleSubmit
          }) => (
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit}
              method="POST"
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                autoFocus
                onChange={handleChange}
                value={values.phone}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                disabled
                id="password"
                label="Password"
                name="password"
                autoFocus
                onChange={handleChange}
                value={values.password}
              />

              <div>
                <ErrorMessage
                  name="email"
                  render={message => (
                    <Typography variant="subtitle2" style={{ color: "red" }}>
                      {message}
                    </Typography>
                  )}
                />
              </div>

              <div>
                <ErrorMessage
                  name="password"
                  render={message => (
                    <Typography variant="subtitle2" style={{ color: "red" }}>
                      {message}
                    </Typography>
                  )}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link to="/forgot-password">Forgot password?</Link>
                </Grid>
                <Grid item>
                  <Link to="/sign-up">{"Don't have an account? Sign Up"}</Link>
                </Grid>
              </Grid> */}
            </form>
          )}
        />
      </Grid>
    </Grid>
  );
}

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
  loadCurrentUser: user => {
    dispatch(actions.loadUser(user));
  }
});

export default connect(mapStateToProps, mapDispachToProps)(Account);
