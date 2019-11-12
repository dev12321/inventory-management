import { LOAD_NOTIFICATIONS } from "../../utils/constants";
import axios from "axios";
import * as groupActions from "../groups";
import * as loadingActions from "../loading";
import * as productActions from "../products";

export const loadNotifications = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios
      .get("/api/notification", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(notificationRes => {
        console.log(notificationRes);

        dispatch({
          type: LOAD_NOTIFICATIONS,
          payload: notificationRes.data.payload
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

export const readNotification = notification => {
  return dispatch => {
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios({
      url: `/api/notification`,
      method: "PUT",
      data: { id: notification._id },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        dispatch(loadingActions.hideLoading());
        dispatch(loadNotifications());
      })
      .catch(err => {
        dispatch(loadingActions.hideLoading());
        console.log(err);
      });
  };
};

export const deleteNotification = notification => {
  return dispatch => {
    const token = localStorage.getItem("IToken");
    dispatch(loadingActions.showLoading());
    axios({
      url: `/api/notification`,
      method: "DELETE",
      data: { id: notification._id },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        dispatch(loadingActions.hideLoading());
        dispatch(loadNotifications());
      })
      .catch(err => {
        dispatch(loadingActions.hideLoading());
        console.log(err);
      });
  };
};
