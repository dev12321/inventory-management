import React, { useState } from "react";
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
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage, FieldArray, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import CustomSnackbar from "./../../components/Snackbar";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "fixed"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  paper: {
    marginTop: "10px"
  }
}));

function NumberFormatCustom(props) {
  const { field, form, ...other } = props;

  return (
    <NumberFormat
      {...other}
      {...field}
      //   thousandSeparator
      //   thousandsGroupStyle="lakh"
      // isNumericString
      decimalScale={0}
      //   prefix="$"
    />
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ShipmentDialog(props) {
  const classes = useStyles();
  const [isSubmiting, setIsSubmiting] = useState(false);

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
            {isSubmiting ? (
              <CircularProgress color="secondary" />
            ) : (
              <Button
                autoFocus
                color="inherit"
                // onClick={props.handleClose}
                type="submit"
                form="add-to-shipment"
              >
                {` Add`}
              </Button>
            )}
          </Toolbar>
        </AppBar>
        {/* <TextField
          //   value={values.numberformat}
          //   onChange={handleChange("numberformat")}
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        /> */}
        <Formik
          initialValues={{
            products: props.data,
            type: 0
          }}
          onSubmit={values => {
            console.log(values);
            props.showLoading();
            setIsSubmiting(true);
            setTimeout(() => {
              props.hideLoading();
              setIsSubmiting(false);
            }, 1000);

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
                product: Yup.string(),
                quantity: Yup.number()
                  .when("maxQuantity", (value, schema) => {
                    // console.log(value);
                    return schema.max(value ? value : 0);
                  })
                  .required("Quantity is required")
              })
            ),
            type: Yup.number().required("Type is Required")
          })}
          validateOnChange
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
              noValidate
              onSubmit={handleSubmit}
              method="POST"
              style={{ marginTop: "40px", padding: "50px" }}
            >
              <FormControl variant="outlined" style={{ width: "20%" }}>
                <InputLabel
                // ref={inputLabel}
                >
                  Shipment Type
                </InputLabel>
                <Select
                  value={values.type}
                  onChange={handleChange}
                  name="type"
                  // labelWidth={labelWidth}
                >
                  <MenuItem value={0}>Incoming</MenuItem>
                  <MenuItem value={1}>Outgoing</MenuItem>
                </Select>
              </FormControl>
              <FieldArray
                name="products"
                render={({
                  move,
                  swap,
                  push,
                  insert,
                  unshift,
                  pop,
                  remove
                }) => (
                  <Paper className={classes.paper}>
                    <Table
                      // className={classes.table}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Product Name</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Remove</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {values.products.map((product, index) => (
                          <TableRow key={product._id}>
                            <Field name={`products[${index}]._id`} hidden />
                            <TableCell component="th" scope="row">
                              {product.productName}
                            </TableCell>
                            <TableCell>
                              <Field
                                type="number"
                                name={`products[${index}].quantity`}
                                component={NumberFormatCustom}
                              />
                              <ErrorMessage
                                name={`products[${index}].quantity`}
                                render={msg => (
                                  <Typography
                                    variant="subtitle2"
                                    style={{ color: "red" }}
                                  >
                                    {msg}
                                  </Typography>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => remove(index)}>
                                {" "}
                                Remove Item
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* {rows.map(row => (
                                <TableCell align="right">
                                  {row.calories}
                                </TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">
                                  {row.protein}
                                </TableCell>
                            ))} */}
                      </TableBody>
                    </Table>
                  </Paper>
                )}
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
