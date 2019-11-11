import React, { useState, useEffect } from "react";
import {
  Avatar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import * as loadingActions from "./../../reducerActions/loading";
import * as groupActions from "./../../reducerActions/groups";
import { connect } from "react-redux";
import * as productActions from "./../../reducerActions/products";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import NumberFormat from "react-number-format";
import DateFnsUtils from "@date-io/date-fns";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={onChange}
      decimalScale={0}
      // thousandSeparator
      // isNumericString
      //   thousandsGroupStyle="lakh"
    />
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    width: "100%" // Fix IE 11 issue.
    // alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function AddProduct(props) {
  const classes = useStyles();

  // const groups = {};
  // props.groupsList.forEach(el => {
  //   groups[el._id] = el.groupName;
  // });
  useEffect(() => {
    if (props.groupsList && props.groupsList.length === 0) {
      props.loadGroups();
    }
  });

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

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add Product
        </Typography>

        <Formik
          initialValues={{
            UPC: 0,
            productName: "",
            description: "",
            quantity: 0,
            manufacturingDate: new Date(),
            expiryDate: new Date(),
            price: 0,
            brand: "",
            group: ""
          }}
          onSubmit={values => {
            console.log(values);
            props.addProduct(values);
          }}
          validationSchema={Yup.object().shape({
            UPC: Yup.number().required("UPC is required"),
            productName: Yup.string().required("Product Name is required"),
            description: Yup.string().required("Description is required"),
            quantity: Yup.number().required("Quantity is required"),
            manufacturingDate: Yup.date(),
            expiryDate: Yup.date(),
            price: Yup.number()
              .required("Price is required")
              .min(1, "Minimum price should not be 0"),
            brand: Yup.string(),
            group: Yup.string().required("Group is required")
          })}
          render={({
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            handleSubmit
          }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2} direction="row">
                    <Grid item xs={4}>
                      <TextField
                        name="UPC"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={target => {
                          setFieldValue("UPC", target.floatValue);
                        }}
                        id="UPC"
                        label="UPC"
                        InputProps={{
                          inputComponent: NumberFormatCustom
                        }}
                      />
                      <ErrorMessage
                        name="UPC"
                        render={message => (
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {message}
                          </Typography>
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        name="productName"
                        variant="outlined"
                        required
                        fullWidth
                        onChange={handleChange}
                        id="productName"
                        label="Product Name"
                      />
                      <ErrorMessage
                        name="productName"
                        render={message => (
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {message}
                          </Typography>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} direction="row">
                    <Grid item xs={4}>
                      <TextField
                        name="quantity"
                        variant="outlined"
                        fullWidth
                        onChange={target => {
                          setFieldValue("quantity", target.floatValue);
                        }}
                        id="quantity"
                        label="Quantity"
                        InputProps={{
                          inputComponent: NumberFormatCustom
                        }}
                      />
                      <ErrorMessage
                        name="quantity"
                        render={message => (
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {message}
                          </Typography>
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        name="price"
                        variant="outlined"
                        onChange={target => {
                          setFieldValue("price", target.floatValue);
                        }}
                        required
                        fullWidth
                        id="price"
                        label="Price"
                        InputProps={{
                          inputComponent: NumberFormatCustom
                        }}
                      />
                      <ErrorMessage
                        name="price"
                        render={message => (
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {message}
                          </Typography>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} direction="row">
                    <Grid item xs={4}>
                      <TextField
                        name="brand"
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        id="brand"
                        label="Brand"
                      />
                      <ErrorMessage
                        name="brand"
                        render={message => (
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {message}
                          </Typography>
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl variant="outlined" style={{ width: "100%" }}>
                        <InputLabel
                        // ref={inputLabel}
                        >
                          Group
                        </InputLabel>
                        <Select
                          value={values.group}
                          onChange={handleChange}
                          name="group"
                          // labelWidth={labelWidth}
                        >
                          {props.groupsList.map(group => (
                            <MenuItem value={group._id} key={group._id}>
                              {group.groupName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <ErrorMessage
                        name="group"
                        render={message => (
                          <Typography
                            variant="subtitle2"
                            style={{ color: "red" }}
                          >
                            {message}
                          </Typography>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    multiline
                    rows="4"
                    id="description"
                    label="Description"
                    name="description"
                  />
                  <ErrorMessage
                    name="description"
                    render={message => (
                      <Typography variant="subtitle2" style={{ color: "red" }}>
                        {message}
                      </Typography>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} direction="row">
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        name="manufacturingDate"
                        id="date-picker-dialog"
                        label="Manufacturing Date"
                        // format="dd/MM/yyyy"
                        value={values.manufacturingDate}
                        onChange={value => {
                          setFieldValue("manufacturingDate", value.toString());
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                      />
                    </MuiPickersUtilsProvider>
                    <ErrorMessage
                      name="manufacturingDate"
                      render={message => (
                        <Typography
                          variant="subtitle2"
                          style={{ color: "red" }}
                        >
                          {message}
                        </Typography>
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        name="expiryDate"
                        margin="normal"
                        id="date-picker-dialog"
                        label="Expiry Date"
                        // format="dd/MM/yyyy"
                        value={values.expiryDate}
                        onChange={value => {
                          setFieldValue("expiryDate", value.toString());
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                      />
                    </MuiPickersUtilsProvider>
                    <ErrorMessage
                      name="expiryDate"
                      render={message => (
                        <Typography
                          variant="subtitle2"
                          style={{ color: "red" }}
                        >
                          {message}
                        </Typography>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sumbit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        />
      </div>
    </Container>
  );
}

const mapStateToProps = state => {
  // console.log("YOO STATE in Overview")
  // console.log(state);
  // console.log(state.firebase.profile);
  return {
    currentUser: state.common.currentUser,
    loading: state.common.loading,
    groupsList: state.common.groupsList
  };
};

const mapDispachToProps = (dispatch, props) => ({
  showLoading: () => {
    dispatch(loadingActions.showLoading());
  },
  hideLoading: () => {
    dispatch(loadingActions.hideLoading());
  },
  addProduct: product => dispatch(productActions.addProduct(product)),
  loadGroups: product => dispatch(groupActions.loadGroups())
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(AddProduct);
