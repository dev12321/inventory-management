import { LOAD_ALL_GROUPS } from "../../utils/constants";
import * as loadingActions from "./../../reducerActions/loading";
import axios from "axios";

export const loadGroups = group => {
  return dispatch => {
    dispatch(loadingActions.showLoading());
    const token = localStorage.getItem("IToken");
    axios
      .get("/api/warehouse/group", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(groupRes => {
        dispatch({
          type: LOAD_ALL_GROUPS,
          payload: groupRes.data.payload
        });
        dispatch(loadingActions.hideLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(loadingActions.hideLoading());
      });
  };
};
