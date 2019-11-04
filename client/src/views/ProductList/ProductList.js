import React, { Component } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import * as productActions from "./../../reducerActions/products";
import * as loadingActions from "./../../reducerActions/loading";

const columns = [
  { field: "UPC", title: "ID" },
  { field: "productName", title: "Name" },
  {
    field: "description",
    title: "Description",
    render: data => data.description.slice(0, 100) + "..."
  },
  { field: "brand", title: "Brand" },
  { field: "price", title: "Price" },
  { field: "quantity", title: "Quantity" },
  {
    field: "manufacturingDate",
    title: "MFD",
    render: data => new Date(data.manufacturingDate).toLocaleDateString()
  },
  {
    field: "expiryDate",
    title: "Expiry Date",
    render: data => new Date(data.expiryDate).toLocaleDateString()
  }
];

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: false
    };
  }
  componentDidMount() {
    if (this.props.productsList.length === 0) {
      this.props.showLoading();
      const token = localStorage.getItem("IToken");

      axios
        .get("/api/warehouse/product", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        })
        .then(res => {
          // console.log(res);
          this.props.loadAllProducts(res.data.payload);
          this.props.hideLoading();
        })
        .catch(err => {
          // console.log(err);
          this.props.hideLoading();
        });
    }
  }

  render() {
    return (
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
              actionsColumnIndex: -1
            }}
          />
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    productsList: state.common.productsList
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
  }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ProductList);
