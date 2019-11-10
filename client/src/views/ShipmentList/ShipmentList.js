import React, { Component } from "react";
import { Paper, Switch, FormControlLabel } from "@material-ui/core";
import axios from "axios";
import MaterialTable, { MTableToolbar } from "material-table";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import * as productActions from "../../reducerActions/products";
import * as loadingActions from "../../reducerActions/loading";
import * as shipmentActions from "../../reducerActions/shipments";
import * as groupActions from "../../reducerActions/groups";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

class ShipmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      selection: true,
      dialogOpen: false
    };
  }

  componentDidMount() {
    if (!this.state.isLoaded && this.props.shipmentsList.length === 0) {
      this.setState({ isLoaded: true });
      this.props.loadAllShipments();
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
    this.setState({ dialogOpen: false, selectedShipments: [] });
  };

  render() {
    const groups = {};
    this.props.groupsList.forEach(el => {
      groups[el._id] = el.groupName;
    });

    const columns = [
      { field: "UPC", title: "ID" },

      { field: "shipmentName", title: "Name" },
      {
        field: "description",
        title: "Description"
        // render: data => data.description.slice(0, 100) + "..."
      },
      { field: "brand", title: "Brand" },
      { field: "price", title: "Price" },
      { field: "quantity", title: "Quantity" },
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
        <Paper
          style={{
            width: "90%",
            margin: "auto"
          }}
        >
          <div>
            <MaterialTable
              title="Shipment List"
              columns={columns}
              data={this.props.shipmentsList}
              options={{
                actionsColumnIndex: -1,
                selection: this.state.selection
              }}
              // editable={
              //   !this.state.selection
              //     ? {
              //         onRowUpdate: (newData, oldData) =>
              //           new Promise(resolve => {
              //             resolve();
              //             if (oldData) {
              //             }
              //           }),
              //         onRowDelete: oldData =>
              //           new Promise(resolve => {
              //             this.props.deleteShipment(oldData);
              //             resolve();
              //           })
              //       }
              //     : {}
              // }
              actions={[
                {
                  tooltip: "Accept the Shipment",
                  icon: "hourglass_full",
                  onClick: (evt, data) => {
                    this.setState({
                      selectedShipments: data,
                      dialogOpen: true
                    });
                    // alert("You want to delete " + data.length + " rows");
                    console.log(data);
                  }
                }
              ]}
              // components={{
              //   Toolbar: props => (
              //     <div>
              //       <MTableToolbar {...props} />
              //       <FormControlLabel
              //         control={
              //           <Switch
              //             checked={this.state.selection}
              //             onChange={this.toggleSelection}
              //             value="selection"
              //             color="primary"
              //           />
              //         }
              //         label="Toggle Selection"
              //       />
              //     </div>
              //   )
              // }}
            />
          </div>
        </Paper>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    shipmentsList: state.common.shipmentsList,
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
  loadAllShipments: shipments => {
    dispatch(shipmentActions.loadShipments(shipments));
  }
  // deleteShipment: shipment => {
  //   dispatch(shipmentActions.deleteShipment(shipment));
  // }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ShipmentList);
