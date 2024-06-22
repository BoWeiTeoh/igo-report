import React from "react";
import { Card } from "reactstrap";

const B2Card = (props) => {
  return <Card {...props}>{props?.children}</Card>;
};

export default B2Card;
