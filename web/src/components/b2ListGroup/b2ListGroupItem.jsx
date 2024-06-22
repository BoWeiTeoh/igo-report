import React from "react";
import { ListGroupItem } from "reactstrap";

const B2ListGroupItem = (props) => {
  return <ListGroupItem {...props}>{props?.children}</ListGroupItem>;
};

export default B2ListGroupItem;
