import React, { Component } from "react";
import { Paper, Switch, FormControlLabel, Typography } from "@material-ui/core";
import axios from "axios";
import MaterialTable, { MTableToolbar } from "material-table";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import * as productActions from "../../reducerActions/products";
import * as loadingActions from "../../reducerActions/loading";
import * as shipmentActions from "../../reducerActions/shipments";
import * as userActions from "../../reducerActions/users";
import * as groupActions from "../../reducerActions/groups";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { USER_ROLES } from "../../utils/constants";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }

  componentDidMount() {
    if (!this.state.isLoaded && this.props.userList.length === 0) {
      this.setState({ isLoaded: true });
      this.props.loadAllUsers();
    } else if (!this.state.isLoaded) {
      this.setState({ isLoaded: true });
    }
  }

  render() {
    const columns = [
      { field: "fullName", title: "Full Name" },
      {
        field: "username",
        title: "Email"
      },
      {
        field: "phone",
        title: "Contact No"
      },
      {
        field: "role",
        title: "Role",
        render: data => <Typography>{USER_ROLES[data.role]}</Typography>
      },
      {
        field: "isVerified",
        title: "Verified?",
        render: data => (
          <Typography>{data.isVerified ? "YES" : "NO"}</Typography>
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
              title="User List"
              columns={columns}
              data={this.props.userList}
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
                    tooltip: "Verify User",
                    icon: "done_all",
                    onClick: (evt, data) => {
                      // this.setState({
                      //   selectedShipments: data,
                      //   dialogOpen: true
                      // });
                      console.log(data);
                    },
                    disabled: rowData.isVerified
                  };
                },
                rowData => {
                  return {
                    tooltip: "Remove User",
                    icon: "delete",
                    onClick: (evt, data) => {
                      // this.setState({
                      //   selectedShipments: data,
                      //   dialogOpen: true
                      // });
                      console.log(data);
                    },
                    disabled: rowData.role === 2
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
    // shipmentsList: state.common.shipmentsList,
    userList: state.common.userList
  };
};

const mapDispachToProps = (dispatch, props) => ({
  showLoading: () => {
    dispatch(loadingActions.showLoading());
  },
  hideLoading: () => {
    dispatch(loadingActions.hideLoading());
  },
  loadAllUsers: () => {
    dispatch(userActions.loadAllUsers());
  }

  // deleteShipment: shipment => {
  //   dispatch(shipmentActions.deleteShipment(shipment));
  // }
});

export default connect(mapStateToProps, mapDispachToProps)(UserList);
