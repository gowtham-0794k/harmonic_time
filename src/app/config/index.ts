import { environment } from '@env/environment';

const baseUrl = environment.apiBaseUrl;

// auth

export const REGISTER_USER = baseUrl + '/api/users/register';
export const LOGIN_USER = baseUrl + '/api/users/login';
export const USER = baseUrl + '/api/users/profile';

// products

export const GET_BRANDS = baseUrl + '/api/products/brands';
export const GET_CATEGORIES = baseUrl + '/api/products/categories';
export const GET_COLLECTION = baseUrl + '/api/products/collection';
export const GET_DIAL_COLOR = baseUrl + '/api/products/dialColors';
export const GET_MOVEMENTS = baseUrl + '/api/products/movements';
export const GET_STRAP_MATERIAL = baseUrl + '/api/products/strapMaterials';
export const GET_CASE_MATERIAL = baseUrl + '/api/products/caseMaterials';
export const GET_WATCH_MARKERS = baseUrl + '/api/products/watchMarkers';
export const GET_DELIVERY_OPTIONS = baseUrl + '/api/products/deliveryOptions';
export const GET_RECIPIENTS = baseUrl + '/api/products/recipients';

export const POST_PRODUCT = baseUrl + '/api/products/createProduct';
export const POST_PRODUCT_DETAILS = baseUrl + '/api/products/productDetails';
export const PRODUCT_DESCRIPTION =
  baseUrl + '/api/products/productDescriptions';
export const POST_PRODUCT_RETURN_POLICY =
  baseUrl + '/api/products/deliveryReturns';
export const POST_UPLOAD_IMAGES = baseUrl + '/api/upload/upload-images-s3/';
export const POST_PRODUCT_IMAGES = baseUrl + '/api/products/productImages';

export const PRODUCT = baseUrl + '/api/products/getAllProducts';
export const GET_PRODUCT_BY_ID = baseUrl + '/api/products/getAllProduct/';

export const UPDATE_PRODUCT = baseUrl + '/api/products/getAllProduct';
export const UPDATE_PRODUCT_DETAILS = baseUrl + '/api/products/productDetails';

export const USER_CART = baseUrl + '/api/cart/user/';
export const ADD_TO_CART = baseUrl + '/api/cart';
export const DELETE_CART_ITEM = baseUrl + '/api/cart/';

export const DELETE_IMAGE_S3 = baseUrl + '/api/upload/delete-image';
export const DELETE_IMAGE_DB = baseUrl + '/api/products/productImages/';

export const CREATE_PAYMENT_ORDER = baseUrl + '/api/payments/create-order';
export const VERIFY_PAYMENT_ORDER = baseUrl + '/api/payments/verify-payment';

export const CREATE_ADDRESS = baseUrl + '/api/users/address';
export const CHECKOUT_ITEM = baseUrl + '/api/checkout';
export const CHECKOUT_ITEM_ORDER = baseUrl + '/api/checkoutItems';
