import "./modal.scss";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "../b2Button/b2Button.jsx";
import Portal from "../portal";

const B2Modal = (props) => {
  let {
    className,
    isOpen = false,
    size,
    children,
    onOutsideClick,
    onConfirm,
    onClose,
    title,
    width,
    confirmText,
    closeText,
    isCenter,
    isConfirmDisable,
    isCloseDisable,
    canScroll
  } = props;
  const [animationClass, setAnimationClass] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimationClass(!!isOpen);
    }, 100);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  let footerNode = null;
  if (typeof onConfirm === "function" && typeof onClose === "function") {
    footerNode = (
      <B2ModalFooter>
        <Button onClick={onClose} disabled={isCloseDisable} className="modal-cancel">
          {closeText || "Cancel"}
        </Button>
        <Button onClick={onConfirm} disabled={isConfirmDisable} className="modal-confirm">
          {confirmText || "Confirm"}
        </Button>
      </B2ModalFooter>
    );
  } else if (typeof onClose === "function") {
    footerNode = (
      <B2ModalFooter>
        <Button onClick={onClose} color="secondary" disabled={isCloseDisable}>
          {closeText || "Close"}
        </Button>
      </B2ModalFooter>
    );
  }

  const bodyNode = [];
  let headerNode;
  React.Children.forEach(children, (child, i) => {
    if (child?.type?.displayName === "B2ModalFooter") {
      footerNode = child;
    } else if (child?.type?.displayName === "B2ModalHeader") {
      headerNode = child;
    } else {
      bodyNode.push(child);
    }
  });

  const styles = {};
  if (isOpen) {
    styles.display = "block";
  }
  return (
    <Portal>
      <div className={clsx("modal fade", animationClass && "show")} style={styles}>
        <div className="overlay" onClick={onOutsideClick} />
        <div className={clsx("modal-dialog", size, size && `modal-${size}`, className)}>
          <div className={clsx("modal-content", isCenter && "modal-center")} style={width && { width: width }}>
            {headerNode}
            {title && (
              <div className={"modal-header"}>
                <p className={"modal-title"}>{title}</p>
              </div>
            )}
            {bodyNode?.length ? (
              <div className={clsx("modal-body", canScroll && "modal-body-scroll")}>{bodyNode}</div>
            ) : null}

            {footerNode}
          </div>
        </div>
      </div>
    </Portal>
  );
};

// for header that are not string
export const B2ModalHeader = (props) => {
  return <div className={"modal-header"}>{props.children}</div>;
};
B2ModalHeader.displayName = "B2ModalHeader";

export const B2ModalFooter = (props) => {
  return <div className={"modal-footer"}>{props.children}</div>;
};
B2ModalFooter.displayName = "B2ModalFooter";

B2Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOutsideClick: PropTypes.func,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.string,
  width: PropTypes.number,
  isConfirmDisable: PropTypes.bool,
  isCloseDisable: PropTypes.bool
};

export default B2Modal;
