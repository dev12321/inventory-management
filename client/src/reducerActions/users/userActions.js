import { LOAD_USER } from "./../../utils/constants";
export const loadUser = user => {
  return {
    type: LOAD_USER,
    payload: user
  };
};
