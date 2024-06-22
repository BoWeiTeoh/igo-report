const constUserDispatch = {
  setUser: "setUser",
  setToken: "setToken",
  removeToken: "removeToken"
};

const constDataDispatch = {
  setCommonData: "setCommonData",
  setData: "setData",
  resetData: "resetData"
};

const constDispatch = {
  ...constUserDispatch,
  ...constDataDispatch,
  setModal: "setModal"
};

export default constDispatch;
