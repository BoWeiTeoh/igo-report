import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./b2Button.scss";
import clsx from "clsx";
import { Button } from "reactstrap";
import PropTypes from "prop-types";

const B2Button = forwardRef((props, ref) => {
  const {
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    color = "primary",
    outline = false,
    size,
    style,
    disabled,
    className,
    withShadow = false,
    title,
    id
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const _isMounted = useRef(true);
  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!_isMounted.current) {
      return;
    }
    setIsLoading(true);
    try {
      await onClick(e);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (_isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleMouseEnter = (e) => {
    typeof onMouseEnter === "function" && onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    typeof onMouseLeave === "function" && onMouseLeave(e);
  };

  return (
    <Button
      size={size}
      color={color}
      outline={outline}
      title={title}
      style={style}
      disabled={disabled || isLoading}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      children={children}
      className={clsx(withShadow && "_shadow", className)}
      id={id}
    />
  );
});

B2Button.propTypes = {
  withShadow: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  permission: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default B2Button;
