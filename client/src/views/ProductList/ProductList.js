import React, { Component } from "react";
import {
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Button
} from "@material-ui/core";
import axios from "axios";
import MaterialTable, { MTableToolbar } from "material-table";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import * as productActions from "./../../reducerActions/products";
import * as loadingActions from "./../../reducerActions/loading";
import * as groupActions from "./../../reducerActions/groups";
import ShipmentDialog from "./AddToShipment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import NumberFormat from "react-number-format";
import { LOAD_ALL_PRODUCTS } from "../../utils/constants";
import { Link } from "react-router-dom";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          value: values.value
        });
      }}
      decimalScale={0}
      // thousandSeparator
      // isNumericString
      //   thousandsGroupStyle="lakh"
    />
  );
}

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProducts: [],
      isLoaded: false,
      selection: false,
      dialogOpen: false
    };
  }

  componentDidMount() {
    if (!this.state.isLoaded && this.props.productsList.length === 0) {
      this.setState({ isLoaded: true });
      this.props.loadAllProducts();
    } else if (!this.state.isLoaded) {
      this.setState({ isLoaded: true });
    }
  }

  toggleSelection = () => {
    this.setState(state => {
      return { ...state, selection: !state.selection };
    });
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false, selectedProducts: [] });
  };

  render() {
    const groups = {};
    this.props.groupsList.forEach(el => {
      groups[el._id] = el.groupName;
    });

    const columns = [
      { field: "UPC", title: "ID" },
      {
        field: "group",
        title: "Category",
        lookup: groups
      },
      { field: "productName", title: "Name" },
      {
        field: "description",
        title: "Description"
        // render: data => data.description.slice(0, 100) + "..."
      },
      { field: "brand", title: "Brand" },
      {
        field: "price",
        title: "Price",
        editComponent: props => {
          return (
            <TextField
              id="outlined-basic"
              // className={classes.textField}
              label="Quantity"
              margin="normal"
              // variant="outlined"
              name="quantity"
              value={props.value}
              onChange={target => {
                console.log(target);
                props.onChange(parseInt(target.value));
              }}
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
            />
          );
        }
      },
      {
        field: "quantity",
        title: "Quantity",
        editComponent: props => {
          return (
            <TextField
              id="outlined-basic"
              // className={classes.textField}
              label="Quantity"
              margin="normal"
              // variant="outlined"
              name="quantity"
              value={props.value}
              onChange={target => {
                console.log(target);
                props.onChange(parseInt(target.value));
              }}
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
            />
          );
        }
      },
      {
        field: "manufacturingDate",
        title: "MFD",
        render: data => new Date(data.manufacturingDate).toLocaleDateString(),
        editComponent: props => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="MFD"
              format="dd/MM/yyyy"
              value={props.value}
              onChange={value => {
                props.onChange(new Date(value));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        )
      },
      {
        field: "expiryDate",
        title: "Expiry Date",
        render: data => new Date(data.expiryDate).toLocaleDateString(),
        editComponent: props => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Expiry Date"
              format="dd/MM/yyyy"
              value={props.value}
              onChange={value => {
                props.onChange(new Date(value));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        )
      }
    ];

    return (
      <>
        <ShipmentDialog
          open={this.state.dialogOpen}
          handleOpen={this.handleDialogOpen}
          handleClose={this.handleDialogClose}
          data={
            this.state.selectedProducts
              ? this.state.selectedProducts.map(prod => {
                  return {
                    product: prod._id,
                    productName: prod.productName,
                    quantity: 1,
                    maxQuantity: prod.quantity
                  };
                })
              : []
          }
        />
        <Paper
          style={{
            width: "90%",
            margin: "auto"
          }}
        >
          <div>
            <MaterialTable
              title="Product List"
              columns={columns}
              data={this.props.productsList}
              options={{
                actionsColumnIndex: -1,
                selection: this.state.selection
              }}
              editable={
                !this.state.selection
                  ? {
                      onRowUpdate: (newData, oldData) =>
                        new Promise(resolve => {
                          // resolve();
                          if (newData) {
                            this.props.updateProduct(newData, resolve);
                          }
                        }),
                      onRowDelete: oldData =>
                        new Promise(resolve => {
                          this.props.deleteProduct(oldData);
                          resolve();
                        })
                    }
                  : {}
              }
              actions={
                this.state.selection
                  ? [
                      {
                        tooltip: "Ship selected products",
                        icon: "local_shipping",
                        onClick: (evt, data) => {
                          this.setState({
                            selectedProducts: data,
                            dialogOpen: true
                          });
                          // alert("You want to delete " + data.length + " rows");
                          console.log(data);
                        }
                      }
                    ]
                  : []
              }
              components={{
                Toolbar: props => (
                  <div>
                    <MTableToolbar {...props} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.selection}
                          onChange={this.toggleSelection}
                          value="selection"
                          color="primary"
                        />
                      }
                      label="Toggle Selection"
                    />
                    <Link to="/add-product">
                      <Button>Add Product</Button>
                    </Link>
                  </div>
                )
              }}
            />
          </div>
        </Paper>
      </>
    );
  }
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
  },
  updateProduct: (product, resolve) => {
    dispatch(productActions.updateProduct(product, resolve));
  }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ProductList);
