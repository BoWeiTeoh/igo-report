import React from "react";
import { Col } from "reactstrap";
import clsx from "clsx";

const B2Col = (props) => {
  const { className } = props || {};
  return <Col {...props} className={clsx("b2col", className)} />;
};

export default B2Col;
