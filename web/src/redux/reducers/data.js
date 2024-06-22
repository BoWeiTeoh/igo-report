import constDispatch from "../constDispatch";

const defaultState = {};

const data = (state = defaultState, action) => {
  let newState = {};
  switch (action.type) {
    case constDispatch.resetData: {
      newState = { ...defaultState };
      return newState;
    }
    case constDispatch.setData: {
      if (typeof action.payload === "object") {
        const { name, data } = action.payload || {};
        if (name && data) {
          newState[name] = data;
        } else {
          newState = action.payload;
        }
      } else {
        throw new Error("setData payload must be object");
      }
      break;
    }
  }

  return {
    ...state,
    ...newState
  };
};

export default data;
