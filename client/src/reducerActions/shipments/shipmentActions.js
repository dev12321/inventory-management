import { LOAD_ALL_SHIPMENTS, UPDATE_LOADING } from "../../utils/constants";
import axios from "axios";
import * as groupActions from "../groups";
import * as loadingActions from "../loading";
import * as productActions from "../products";

export const loadShipments = () => {
  return (dispatch, getState) => {
    const state = getState();
    console.log(state);

    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios
      .get("/api/warehouse/shipment", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(shipmentRes => {
        dispatch({
          type: LOAD_ALL_SHIPMENTS,
          payload: shipmentRes.data.payload
        });
        if (state.common.groupsList.length === 0) {
          dispatch(groupActions.loadGroups());
        } else {
          dispatch(loadingActions.hideLoading());
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(loadingActions.hideLoading());
      });
  };
};

export const deleteShipment = shipment => {
  return dispatch => {
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios
      .delete("/api/warehouse/shipment", {
        method: "post",
        data: { id: shipment._id },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(res => {
        dispatch(loadShipments());
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const updateShipment = (type, shipment) => {
  return dispatch => {
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios({
      url: "/api/warehouse/shipment",
      method: "PUT",
      data: { id: shipment._id, type },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        dispatch(loadingActions.hideLoading());
        dispatch(productActions.loadProducts());
        dispatch(loadShipments());
      })
      .catch(err => {
        dispatch(loadingActions.hideLoading());
        console.log(err);
      });
  };
};
