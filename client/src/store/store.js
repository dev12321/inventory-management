import { createStore, combineReducers } from "redux";
import commonReducer from "./reducers";
const finalReducer = combineReducers({
  common: commonReducer
});

const configureStore = () => {
  const store = createStore(
    finalReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};

export default configureStore;
