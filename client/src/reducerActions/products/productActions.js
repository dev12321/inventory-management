import { LOAD_ALL_PRODUCTS, UPDATE_LOADING } from "../../utils/constants";
import axios from "axios";
import * as groupActions from "./../../reducerActions/groups";
import * as loadingActions from "./../../reducerActions/loading";

export const loadProducts = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios
      .get("/api/warehouse/product", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(productRes => {
        dispatch({
          type: LOAD_ALL_PRODUCTS,
          payload: productRes.data.payload
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

export const deleteProduct = product => {
  return dispatch => {
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios
      .delete("/api/warehouse/product", {
        method: "post",
        data: { id: product._id },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(res => {
        dispatch(loadProducts());
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const updateProduct = (product, resolve) => {
  return dispatch => {
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios({
      url: "/api/warehouse/product",
      method: "PUT",
      data: product,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        dispatch(loadProducts());

        resolve();
      })
      .catch(err => {
        console.log(err);
        dispatch(loadingActions.hideLoading());
        resolve();
      });
  };
};
export const addProduct = product => {
  return dispatch => {
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios({
      url: "/api/warehouse/product",
      method: "POST",
      data: product,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        dispatch(loadProducts());
      })
      .catch(err => {
        console.log(err);
        dispatch(loadingActions.hideLoading());
      });
  };
};
