import { baseUrl } from "./config.js";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const sliderImgs = () =>
  fetch(`${baseUrl}galary/`)
    .then((r) => r.json())
    .catch(() => []);

export const registerFunction = (name, email, password) =>
  fetch(`${baseUrl}users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: name, email, password, isadmin: false }),
  })
    .then((r) => r.json())
    .catch(() => null);

export const loginFunction = (username, password) =>
  fetch(`${baseUrl}token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((r) => r.json())
    .catch(() => null);

export const getProduct = () =>
  fetch(`${baseUrl}products/`)
    .then((r) => r.json())
    .catch(() => null);

export const getCategories = () =>
  fetch(`${baseUrl}categories/`)
    .then((r) => r.json())
    .catch(() => null);

export const getBrands = () =>
  fetch(`${baseUrl}brands/`)
    .then((r) => r.json())
    .catch(() => null);

// ===== LIKED ITEMS =====
export const getLikedItems = (token) =>
  fetch(`${baseUrl}liked-items/`, { headers: authHeaders(token) })
    .then((r) => r.json())
    .catch(() => []);

export const addLike = (token, productId) =>
  fetch(`${baseUrl}liked-items/add/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product: productId }),
  })
    .then((r) => r.json())
    .catch(() => null);

export const removeLike = (token, likeId) =>
  fetch(`${baseUrl}liked-items/${likeId}/`, {
    method: "DELETE",
    headers: authHeaders(token),
  }).catch(() => null);

// ===== CART ITEMS =====
export const getCartItems = (token) =>
  fetch(`${baseUrl}cart-items/`, { headers: authHeaders(token) })
    .then((r) => r.json())
    .catch(() => []);

export const addToCart = (token, productId, amount = 1) =>
  fetch(`${baseUrl}cart-items/create`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product: productId, amount }),
  })
    .then((r) => r.json())
    .catch(() => null);

export const updateCartItem = (token, cartItemId, amount) =>
  fetch(`${baseUrl}cart-items/${cartItemId}/`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ amount }),
  })
    .then((r) => r.json())
    .catch(() => null);

export const removeCartItem = (token, cartItemId) =>
  fetch(`${baseUrl}cart-items/${cartItemId}/`, {
    method: "DELETE",
    headers: authHeaders(token),
  }).catch(() => null);

// ===== ORDERS =====
export const createOrder = (token, cartItemIds) =>
  fetch(`${baseUrl}checkout/items/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ cart_item_ids: cartItemIds }),
  })
    .then((r) => r.json())
    .catch(() => null);

export const getOrders = (token) =>
  fetch(`${baseUrl}orders/`, { headers: authHeaders(token) })
    .then((r) => r.json())
    .catch(() => []);
