import React from "react";
import { CardHeader } from "reactstrap";

const B2CardHeader = (props) => {
  return <CardHeader {...props}>{props?.children}</CardHeader>;
};

export default B2CardHeader;
