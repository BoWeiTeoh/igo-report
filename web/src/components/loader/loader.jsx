import React from "react";
import "./loader.scss";
import clsx from "clsx";

const Loader = ({ size = 64, style, isFullLoader, className, isLoading = true }) => {
  const containerStyle = {
    width: size + 3,
    height: size + 3
  };
  const divStyle = {
    width: size,
    height: size,
    borderWidth: size / 9
  };

  const node = (
    <div className={clsx("lds-ring b2loader", isLoading === false && "noloading", className)} style={style}>
      <div className={"lds-ring-inner"} style={containerStyle}>
        <div style={divStyle} className={"spinner"} />
        <div style={divStyle} className={"spinner"} />
        <div style={divStyle} className={"spinner"} />
        <div style={divStyle} className={"spinner"} />
      </div>
    </div>
  );

  if (isFullLoader) {
    return <div className={clsx("full-loader", className)}>{node}</div>;
  }
  return node;
};

export default Loader;
