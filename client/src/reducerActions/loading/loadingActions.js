import { UPDATE_LOADING } from "../../utils/constants";

export const showLoading = () => {
  return {
    type: UPDATE_LOADING,
    payload: {
      loading: true
    }
  };
};

export const hideLoading = () => {
  return {
    type: UPDATE_LOADING,
    payload: {
      loading: false
    }
  };
};
