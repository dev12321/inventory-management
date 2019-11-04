import {
  LOAD_ALL_GROUPS,
  LOAD_ALL_PRODUCTS,
  LOAD_ALL_SHIPMENTS,
  LOAD_USER,
  UPDATE_LOADING
} from "./../../utils/constants";

const intitState = {
  groupsList: [],
  currentUser: {},
  productsList: [],
  shipmentsList: [],
  loading: false
};

const commonReducer = (state = intitState, action) => {
  switch (action.type) {
    case LOAD_ALL_GROUPS:
      return {
        ...state,
        groupsList: action.payload
      };
    case LOAD_ALL_SHIPMENTS:
      return {
        ...state,
        shipmentsList: action.payload
      };
    case LOAD_ALL_PRODUCTS:
      return {
        ...state,
        productsList: action.payload
      };
    case LOAD_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    case UPDATE_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };

    default:
      return state;
  }
};

export default commonReducer;
