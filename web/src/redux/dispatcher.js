import store from "./store";
import constDispatch from "./constDispatch";

export const dispatchState = (type, payload) => {
  store.dispatch({ type: type, payload: payload });
};

export const openModalGlobal = (name, props) => {
  store.dispatch({ type: constDispatch.setModal, payload: { name, props } });
};

export const closeModalGlobal = () => {
  store.dispatch({ type: constDispatch.setModal, payload: null });
};
