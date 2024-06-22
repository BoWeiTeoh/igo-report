import React from "react";
import { ListGroup } from "reactstrap";

const B2ListGroup = (props) => {
  return <ListGroup {...props}>{props?.children}</ListGroup>;
};

export default B2ListGroup;
