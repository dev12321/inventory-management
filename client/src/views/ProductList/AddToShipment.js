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
    <div>
      <CustomSnackbar
        onClose={handleClose}
        open={snackbarDetails.open}
        message={snackbarDetails.message}
        variant={snackbarDetails.variant}
      />
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
              <CircularProgress style={{ color: "white" }} />
            ) : (
              <Button
                autoFocus
                color="inherit"
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
            type: 0,
            name: "",
            description: ""
          }}
          onSubmit={values => {
            console.log(values);
            props.showLoading();
            setIsSubmiting(true);
            // setTimeout(() => {
            //   props.hideLoading();
            //   setIsSubmiting(false);
            // }, 1000);
            const finalData = {
              products: values.products.map(prod => {
                return {
                  product: prod.product,
                  quantity: prod.quantity
                };
              }),
              type: values.type,
              name: values.name,
              description: values.description
            };

            const token = localStorage.getItem("IToken");
            axios({
              url: "/api/warehouse/shipment",
              method: "POST",
              data: finalData,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
              }
            })
              .then(res => {
                props.hideLoading();
                console.log(res.data);
                setSnackbarDetails({
                  message: res.data.message,
                  variant: "success",
                  open: true
                });
                props.loadAllProducts();
                props.handleClose();
                setIsSubmiting(false);
              })
              .catch(err => {
                setIsSubmiting(false);
                props.hideLoading();
                setSnackbarDetails({
                  message: err.response.data.message,
                  variant: "error",
                  open: true
                });
              });
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
            type: Yup.number().required("Type is Required"),
            name: Yup.string().required("Name is Required"),
            description: Yup.string().required("Description is Required")
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
              <Grid container style={{ width: "100%" }}>
                <Grid container direction="row" spacing xs={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="outlined-basic"
                      // className={classes.textField}
                      label="Shipment Name"
                      margin="normal"
                      variant="outlined"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name={`name`}
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
                  <Grid item xs={6}>
                    <FormControl variant="outlined">
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
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    name="description"
                    rows="4"
                    defaultValue="Default Value"
                    value={values.description}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                  <ErrorMessage
                    name={`description`}
                    render={message => (
                      <Typography variant="subtitle2" style={{ color: "red" }}>
                        {message}
                      </Typography>
                    )}
                  />
                </Grid>
              </Grid>

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
                                render={message => (
                                  <Typography
                                    variant="subtitle2"
                                    style={{ color: "red" }}
                                  >
                                    {message}
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
                  render={message => (
                    <Typography variant="subtitle2" style={{ color: "red" }}>
                      {message}
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
  loadAllProducts: () => {
    dispatch(productActions.loadProducts());
  },
  deleteProduct: product => {
    dispatch(productActions.deleteProduct(product));
  }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ShipmentDialog);
