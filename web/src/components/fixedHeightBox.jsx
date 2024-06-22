import React from "react";
import clsx from "clsx";
import { useWindowDimensions } from "../helpers/reactHooks.js";

const HEADER_HEIGHT = 160;
const FixedHeightBox = ({ children, className }) => {
  const { height } = useWindowDimensions();

  const styles = {
    height: height - HEADER_HEIGHT
  };
  return (
    <div className={clsx("page-info-box", className)} style={styles}>
      <div className={"whitebox fullheight"}>{children}</div>
    </div>
  );
};

export default FixedHeightBox;
