import { UPDATE_LOADING } from "../../utils/constants";

export const showLoading = () => {
  return dispatch =>
    dispatch({
      type: UPDATE_LOADING,
      payload: {
        loading: true
      }
    });
};

export const hideLoading = () => {
  return dispatch =>
    dispatch({
      type: UPDATE_LOADING,
      payload: {
        loading: false
      }
    });
};
