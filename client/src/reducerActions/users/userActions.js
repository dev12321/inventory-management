import { LOAD_USER, LOAD_ALL_USER } from "./../../utils/constants";
import * as groupActions from "./../../reducerActions/groups";
import * as loadingActions from "./../../reducerActions/loading";
import axios from "axios";

export const loadUser = user => {
  return {
    type: LOAD_USER,
    payload: user
  };
};

export const loadAllUsers = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios
      .get("/api/users", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(productRes => {
        console.log(productRes.data.payload);
        dispatch({
          type: LOAD_ALL_USER,
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
