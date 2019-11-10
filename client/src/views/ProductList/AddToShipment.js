import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as productActions from "./../../reducerActions/products";
import * as loadingActions from "./../../reducerActions/loading";
import * as groupActions from "./../../reducerActions/groups";
import {
  Button,
  Dialog,
  ListItemText,
  ListItem,
  List,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import CustomSnackbar from "./../../components/Snackbar";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      //   thousandSeparator
      //   thousandsGroupStyle="lakh"
      isNumericString
      //   prefix="$"
    />
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ShipmentDialog(props) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Shipment
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={props.handleClose}
              type="submit"
              form="add-to-shipment"
            >
              Add
            </Button>
          </Toolbar>
        </AppBar>
        <Formik onSubmit />
        <TextField
          //   className={classes.formControl}
          label="react-number-format"
          //   value={values.numberformat}
          //   onChange={handleChange("numberformat")}
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />
        {/* <List>
           <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem> 
        </List>*/}
        <Formik
          initialValues={{
            products: [],
            status: 0,
            type: 0
          }}
          onSubmit={values => {
            // props.showLoading();
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
          validationSchema={Yup.object().shape({
            products: Yup.array().of(
              Yup.object().shape({
                productID: Yup.string().required("Product ID is required"),
                quantity: Yup.number()
                  .when("$productID", (value, schema) => {
                    const product = props.data.find(el => el._id === value);
                    return schema.max(product.quantity);
                  })
                  .required("Quantity is required")
              })
            ),
            status: Yup.number().required("Status is Required")
          })}
          render={({
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            handleSubmit
          }) => (
            <form
              id={"add-to-shipment"}
              className={classes.form}
              noValidate
              onSubmit={handleSubmit}
              method="POST"
            >
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel
                // ref={inputLabel}
                >
                  Age
                </InputLabel>
                <Select
                  value={values.type}
                  onChange={handleChange}
                  // labelWidth={labelWidth}
                >
                  <MenuItem value={0}>Incoming</MenuItem>
                  <MenuItem value={1}>Outgoing</MenuItem>
                </Select>
              </FormControl>
              <FieldArray
                name="products"
                render={({ move, swap, push, insert, unshift, pop }) =>
                  values.products.map(product => {
                    return <TextField name={product._id} />;
                  })
                }
              />
              {/* 
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="status"
                label="Email Address"
                name="status"
                autoFocus
                onChange={handleChange}
                value={values.status}
              />
              <div>
                <ErrorMessage
                  name="status"
                  render={msg => (
                    <Typography variant="subtitle2" style={{ color: "red" }}>
                      {msg}
                    </Typography>
                  )}
                />
              </div>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="type"
                label="Password"
                type="type"
                id="type"
                autoComplete="current-type"
                onChange={handleChange}
                value={values.type}
              />
              <div>
                <ErrorMessage
                  name="type"
                  render={msg => (
                    <Typography variant="subtitle2" style={{ color: "red" }}>
                      {msg}
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
                Sign In
              </Button>
              <Grid container>
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
      </Dialog>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    productsList: state.common.productsList,
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
  loadAllProducts: products => {
    dispatch(productActions.loadProducts(products));
  },
  deleteProduct: product => {
    dispatch(productActions.deleteProduct(product));
  }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ShipmentDialog);
