import React from "react";

// component to prevent modal being construct before open
const B2ModalGroup = ({ children }) => {
  const modalToOpen = React.Children.toArray(children).find((child) => child.props.isOpen);
  if (modalToOpen) {
    return modalToOpen;
  }

  return null;
};

export default B2ModalGroup;
