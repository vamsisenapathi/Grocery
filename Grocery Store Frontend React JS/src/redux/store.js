import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import authReducer from './reducers/authReducer';
import cartReducer from './reducers/cartReducer';
import productReducer from './reducers/productReducer';
import categoryReducer from './reducers/categoryReducer';
import addressReducer from './reducers/addressReducer';
import orderReducer from './reducers/orderReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  categories: categoryReducer,
  addresses: addressReducer,
  orders: orderReducer,
});

// Create store with thunk middleware
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
