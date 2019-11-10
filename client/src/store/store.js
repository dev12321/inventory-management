import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import commonReducer from "./reducers";
import thunk from "redux-thunk";

const finalReducer = combineReducers({
  common: commonReducer
});

const configureStore = (initialState = {}) => {
  const store = createStore(
    finalReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
    // window.__REDUX_DEVTOOLS_EXTENSION__ &&
    //   window.__REDUX_DEVTOOLS_EXTENSION__()
    //
  );

  return store;
};

export default configureStore;
