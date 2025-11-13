// ========================================
// AUTH ACTION TYPES
// ========================================
export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

export const REGISTER_REQUEST = 'auth/REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'auth/REGISTER_FAILURE';

export const LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'auth/LOGOUT_FAILURE';

export const CLEAR_AUTH_ERROR = 'auth/CLEAR_AUTH_ERROR';

// ========================================
// CART ACTION TYPES
// ========================================
export const FETCH_CART_REQUEST = 'cart/FETCH_CART_REQUEST';
export const FETCH_CART_SUCCESS = 'cart/FETCH_CART_SUCCESS';
export const FETCH_CART_FAILURE = 'cart/FETCH_CART_FAILURE';

export const ADD_TO_CART_REQUEST = 'cart/ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'cart/ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAILURE = 'cart/ADD_TO_CART_FAILURE';

export const UPDATE_CART_ITEM_REQUEST = 'cart/UPDATE_CART_ITEM_REQUEST';
export const UPDATE_CART_ITEM_SUCCESS = 'cart/UPDATE_CART_ITEM_SUCCESS';
export const UPDATE_CART_ITEM_FAILURE = 'cart/UPDATE_CART_ITEM_FAILURE';

export const REMOVE_CART_ITEM_REQUEST = 'cart/REMOVE_CART_ITEM_REQUEST';
export const REMOVE_CART_ITEM_SUCCESS = 'cart/REMOVE_CART_ITEM_SUCCESS';
export const REMOVE_CART_ITEM_FAILURE = 'cart/REMOVE_CART_ITEM_FAILURE';

export const CLEAR_CART_REQUEST = 'cart/CLEAR_CART_REQUEST';
export const CLEAR_CART_SUCCESS = 'cart/CLEAR_CART_SUCCESS';
export const CLEAR_CART_FAILURE = 'cart/CLEAR_CART_FAILURE';

// ========================================
// PRODUCTS ACTION TYPES
// ========================================
export const FETCH_PRODUCTS_REQUEST = 'products/FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'products/FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'products/FETCH_PRODUCTS_FAILURE';

export const FETCH_PRODUCT_BY_ID_REQUEST = 'products/FETCH_PRODUCT_BY_ID_REQUEST';
export const FETCH_PRODUCT_BY_ID_SUCCESS = 'products/FETCH_PRODUCT_BY_ID_SUCCESS';
export const FETCH_PRODUCT_BY_ID_FAILURE = 'products/FETCH_PRODUCT_BY_ID_FAILURE';

export const SEARCH_PRODUCTS_REQUEST = 'products/SEARCH_PRODUCTS_REQUEST';
export const SEARCH_PRODUCTS_SUCCESS = 'products/SEARCH_PRODUCTS_SUCCESS';
export const SEARCH_PRODUCTS_FAILURE = 'products/SEARCH_PRODUCTS_FAILURE';

// ========================================
// CATEGORIES ACTION TYPES
// ========================================
export const FETCH_CATEGORIES_REQUEST = 'categories/FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'categories/FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'categories/FETCH_CATEGORIES_FAILURE';

export const FETCH_CATEGORY_BY_ID_REQUEST = 'categories/FETCH_CATEGORY_BY_ID_REQUEST';
export const FETCH_CATEGORY_BY_ID_SUCCESS = 'categories/FETCH_CATEGORY_BY_ID_SUCCESS';
export const FETCH_CATEGORY_BY_ID_FAILURE = 'categories/FETCH_CATEGORY_BY_ID_FAILURE';

// ========================================
// ADDRESSES ACTION TYPES
// ========================================
export const FETCH_ADDRESSES_REQUEST = 'addresses/FETCH_ADDRESSES_REQUEST';
export const FETCH_ADDRESSES_SUCCESS = 'addresses/FETCH_ADDRESSES_SUCCESS';
export const FETCH_ADDRESSES_FAILURE = 'addresses/FETCH_ADDRESSES_FAILURE';

export const ADD_ADDRESS_REQUEST = 'addresses/ADD_ADDRESS_REQUEST';
export const ADD_ADDRESS_SUCCESS = 'addresses/ADD_ADDRESS_SUCCESS';
export const ADD_ADDRESS_FAILURE = 'addresses/ADD_ADDRESS_FAILURE';

export const UPDATE_ADDRESS_REQUEST = 'addresses/UPDATE_ADDRESS_REQUEST';
export const UPDATE_ADDRESS_SUCCESS = 'addresses/UPDATE_ADDRESS_SUCCESS';
export const UPDATE_ADDRESS_FAILURE = 'addresses/UPDATE_ADDRESS_FAILURE';

export const DELETE_ADDRESS_REQUEST = 'addresses/DELETE_ADDRESS_REQUEST';
export const DELETE_ADDRESS_SUCCESS = 'addresses/DELETE_ADDRESS_SUCCESS';
export const DELETE_ADDRESS_FAILURE = 'addresses/DELETE_ADDRESS_FAILURE';

export const SET_DEFAULT_ADDRESS_REQUEST = 'addresses/SET_DEFAULT_ADDRESS_REQUEST';
export const SET_DEFAULT_ADDRESS_SUCCESS = 'addresses/SET_DEFAULT_ADDRESS_SUCCESS';
export const SET_DEFAULT_ADDRESS_FAILURE = 'addresses/SET_DEFAULT_ADDRESS_FAILURE';

// ========================================
// ORDERS ACTION TYPES
// ========================================
export const FETCH_ORDERS_REQUEST = 'orders/FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'orders/FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'orders/FETCH_ORDERS_FAILURE';

export const FETCH_ORDER_BY_ID_REQUEST = 'orders/FETCH_ORDER_BY_ID_REQUEST';
export const FETCH_ORDER_BY_ID_SUCCESS = 'orders/FETCH_ORDER_BY_ID_SUCCESS';
export const FETCH_ORDER_BY_ID_FAILURE = 'orders/FETCH_ORDER_BY_ID_FAILURE';

export const CREATE_ORDER_REQUEST = 'orders/CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'orders/CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'orders/CREATE_ORDER_FAILURE';

export const CANCEL_ORDER_REQUEST = 'orders/CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = 'orders/CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = 'orders/CANCEL_ORDER_FAILURE';
