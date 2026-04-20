export const getToken = () => {
  return localStorage.getItem("shopToken");
};

export const setToken = (token) => {
  localStorage.setItem("shopToken", token);
};
