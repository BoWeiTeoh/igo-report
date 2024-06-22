import React from "react";

const SideBarNav = (props) => {
  const { activeLink, onClick, permissions, children } = props || {};

  // pass parent props to children
  const childrenWithProps = React.Children.map(children, (child) => {
    return React.cloneElement(child, { onClick, activeLink, permissions });
  });

  return <React.Fragment>{childrenWithProps}</React.Fragment>;
};

export default SideBarNav;
