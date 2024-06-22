import { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const canUseDOM = (typeof window !== "undefined");

let node;
const Portal = ({ children }) => {
  const rootBody = document.querySelector("body");
  useEffect(() => {
    return () => {
      if (node) {
        document.body.removeChild(node);
      }
      node = null;
      rootBody.classList.remove("modal-open");
    };
  }, []);

  if (!canUseDOM) {
    return null;
  }

  if (!node) {
    rootBody.classList.add("modal-open");
    node = document.createElement("div");
    document.body.appendChild(node);
  }
  return ReactDOM.createPortal(children, node);
};

Portal.propTypes = {
  children: PropTypes.node.isRequired
};

export default Portal;
