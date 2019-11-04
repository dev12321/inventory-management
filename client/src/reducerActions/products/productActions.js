import { LOAD_ALL_PRODUCTS } from "../../utils/constants";
export const loadProducts = product => {
  return {
    type: LOAD_ALL_PRODUCTS,
    payload: product
  };
};
