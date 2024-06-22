import constDispatch from "../constDispatch";

const defaultState = {};

const common = (state = defaultState, action) => {
  let newState = {};
  const { payload, type } = action || {};
  switch (type) {
    case constDispatch.setModal: {
      if (typeof payload === "object") {
        const { name, data } = payload || {};
        newState.modal = {
          name,
          data
        };
      } else {
        throw new Error("setData payload must be object");
      }
      break;
    }
    case constDispatch.setCommonData: {
      newState.commonData = payload;
      break;
    }
  }

  return {
    ...state,
    ...newState
  };
};

export default common;
