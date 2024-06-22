import React from "react";
import { B2ButtonGroup } from "../../components";
import clsx from "clsx";
import B2Icon from "../../../components/b2Icon/b2Icon.jsx";

const BasePageAction = ({ children }) => {
  return (
    <B2ButtonGroup style={{ marginBottom: 15, textAlign: "right" }} size={"sm"}>
      <div className={clsx("whitebox2 transition")} style={{ minHeight: 42, minWidth: 42 }}>
        <B2Icon icon={"icon-process"} fontSize={24} />
        {children}
      </div>
    </B2ButtonGroup>
  );
};

export default BasePageAction;
