import { environment } from '@env/environment';

const baseUrl = environment.apiBaseUrl;

// auth
export const REGISTER_USER = `${baseUrl}/auth/register`;
export const LOGIN_USER = `${baseUrl}/auth/login`;
export const USER = `${baseUrl}/users/profile`;

// catalog lookups
export const GET_BRANDS = `${baseUrl}/brands`;
export const GET_CATEGORIES = `${baseUrl}/categories`;
export const GET_COLLECTIONS = `${baseUrl}/collections`;
export const GET_DIAL_COLORS = `${baseUrl}/dial-colors`;
export const GET_MOVEMENTS = `${baseUrl}/movements`;
export const GET_STRAP_MATERIALS = `${baseUrl}/strap-materials`;
export const GET_CASE_MATERIALS = `${baseUrl}/case-materials`;
export const GET_WATCH_MARKERS = `${baseUrl}/watch-markers`;
export const GET_DELIVERY_OPTIONS = `${baseUrl}/delivery-options`;
export const GET_RECIPIENTS = `${baseUrl}/recipients`;

// products
export const POST_PRODUCT = `${baseUrl}/products`;
export const PRODUCT = `${baseUrl}/products`;
export const GET_PRODUCT_BY_ID = (productID: string) =>
  `${baseUrl}/products/${productID}`;

// only availability update exists in backend
export const UPDATE_PRODUCT_AVAILABILITY = `${baseUrl}/products/availability`;
export const UPDATE_PRODUCT = UPDATE_PRODUCT_AVAILABILITY;

// product details
export const POST_PRODUCT_DETAILS = `${baseUrl}/product-details`;
export const GET_PRODUCT_DETAILS = (productID: string) =>
  `${baseUrl}/product-details/${productID}`;
export const UPDATE_PRODUCT_DETAILS = (productID: string) =>
  `${baseUrl}/product-details/${productID}`;

// product descriptions
export const POST_PRODUCT_DESCRIPTION = `${baseUrl}/product-descriptions`;
export const GET_ALL_PRODUCT_DESCRIPTIONS = `${baseUrl}/product-descriptions`;
export const GET_PRODUCT_DESCRIPTION = (productID: string) =>
  `${baseUrl}/product-descriptions/${productID}`;
export const UPDATE_PRODUCT_DESCRIPTION = (productID: string) =>
  `${baseUrl}/product-descriptions/${productID}`;

// delivery returns
export const POST_PRODUCT_RETURN_POLICY = `${baseUrl}/delivery-returns`;
export const GET_PRODUCT_RETURN_POLICY = (productID: string) =>
  `${baseUrl}/delivery-returns/product/${productID}`;
export const UPDATE_PRODUCT_RETURN_POLICY = (productID: string) =>
  `${baseUrl}/delivery-returns/product/${productID}`;

// uploads
export const POST_UPLOAD_IMAGES = `${baseUrl}/upload/images`;
// S3 deletion is keyed by image URL sent in the request body
export const DELETE_IMAGE_S3 = `${baseUrl}/upload/images`;

// product images
export const POST_PRODUCT_IMAGES = `${baseUrl}/product-images`;
export const GET_PRODUCT_IMAGES = (productID: string) =>
  `${baseUrl}/product-images/product/${productID}`;
export const GET_PRODUCT_IMAGE_BY_ID = (imageID: string) =>
  `${baseUrl}/product-images/${imageID}`;
export const DELETE_IMAGE_DB = (imageID: string) =>
  `${baseUrl}/product-images/${imageID}`;

// cart
export const USER_CART = (userID: string) => `${baseUrl}/cart/user/${userID}`;
export const ADD_TO_CART = `${baseUrl}/cart`;
export const DELETE_CART_ITEM = (cartID: string) => `${baseUrl}/cart/${cartID}`;

// payments
export const CREATE_PAYMENT_ORDER = `${baseUrl}/payments/create-order`;
export const VERIFY_PAYMENT_ORDER = `${baseUrl}/payments/verify`;

// address
export const CREATE_ADDRESS = `${baseUrl}/address`;
export const GET_ADDRESSES_BY_USER = (userID: string) =>
  `${baseUrl}/address/user/${userID}`;

// checkout
export const CHECKOUT_ITEM = `${baseUrl}/checkout`;
export const GET_ORDERS = (userID: string) =>
  `${baseUrl}/checkout/user/${userID}`;

// checkout items
export const CHECKOUT_ITEM_ORDER = `${baseUrl}/checkout-items`;
export const CHECKOUT_ITEMS = (checkoutID: string) =>
  `${baseUrl}/checkout-items/checkout/${checkoutID}`;
