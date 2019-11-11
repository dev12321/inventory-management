import React, { Component } from "react";
import { Paper, Switch, FormControlLabel, Typography } from "@material-ui/core";
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
import { SHIPMENT_TYPES, SHIPMENT_STATUS } from "../../utils/constants";

class ShipmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
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
      { field: "shipmentName", title: "Shipment Name" },
      {
        field: "description",
        title: "Description"
        // render: data => data.description.slice(0, 100) + "..."
      },
      {
        field: "shipmentType",
        title: "Shipment Type",
        render: data => (
          <Typography>{SHIPMENT_TYPES[data.shipmentType]}</Typography>
        )
      },
      {
        field: "shipmentStatus",
        title: "Shipment Status",
        render: data => (
          <Typography>{SHIPMENT_STATUS[data.shipmentStatus]}</Typography>
        )
      },
      {
        field: "createdAt",
        title: "Entry Create At",
        render: data => new Date(data.createdAt).toLocaleDateString()
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
                actionsColumnIndex: -1
              }}
              // editable={{
              //   onRowDelete: oldData =>
              //     new Promise(resolve => {
              //       this.props.deleteShipment(oldData);
              //       resolve();
              //     })
              // }}
              actions={[
                rowData => {
                  return {
                    tooltip: "Accept Shipment",
                    icon: "done_all",
                    onClick: (evt, data) => {
                      // this.setState({
                      //   selectedShipments: data,
                      //   dialogOpen: true
                      // });
                      console.log(data);
                      this.props.receiveShipment(data);
                    },
                    disabled: rowData.shipmentStatus > 0
                  };
                },
                rowData => {
                  return {
                    tooltip: "Cancel",
                    icon: "cancel_schedule_send",
                    onClick: (evt, data) => {
                      // this.setState({
                      //   selectedShipments: data,
                      //   dialogOpen: true
                      // });
                      console.log(data);
                      this.props.cancelShipment(data);
                    },
                    disabled: rowData.shipmentStatus !== 0
                  };
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
  },
  receiveShipment: shipment => {
    dispatch(shipmentActions.updateShipment("COMPLETE", shipment));
  },
  cancelShipment: shipment => {
    dispatch(shipmentActions.updateShipment("CANCEL", shipment));
  }
  // deleteShipment: shipment => {
  //   dispatch(shipmentActions.deleteShipment(shipment));
  // }
});

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ShipmentList);
