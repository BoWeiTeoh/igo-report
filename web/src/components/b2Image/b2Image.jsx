import React from "react";
import "./image.scss";
import clsx from "clsx";

const B2Image = ({
                   src,
                   style,
                   imgStyle,
                   alt,
                   withHost = true,
                   round,
                   width,
                   height,
                   onClick,
                   isAvatar,
                   withDevHost,
                   nullIfNoImg,
                   isIcon = false,
                   className,
                   id
                 }) => {
  if (nullIfNoImg) {
    return null;
  }

  let containerStyle = style || {};
  if (width) {
    containerStyle.width = width;
  }
  if (height) {
    containerStyle.height = height;
  }

  let iconNode;
  if (isIcon) {
    iconNode = <img src={src} className={`${className}`} alt={alt} id={id} onClick={onClick}/>;
  }

  return (
    isIcon ? (iconNode) :
      (<div
        className={clsx("image-container", round && "image-round", onClick && "islink")}
        style={containerStyle}
        onClick={onClick}
      >
        {src && <img src={src} className={"_img"} alt={alt} style={imgStyle} />}
      </div>)
  );
};

export default B2Image;
