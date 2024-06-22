import React, { useRef, useState } from "react";
import CustomCheckbox from "../customCheckbox/customCheckbox";
import { Button, Popover, PopoverBody } from "reactstrap";
import { locale } from "../../locale";
import { generateRandomNumber, getPopOverId } from "../../helpers/util";

const ReactTable8ColumnVisibility = ({ table, style, placement }) => {
  const [isColumnEdit, setIsColumnEdit] = useState(false);
  const id = useRef(getPopOverId(generateRandomNumber()));

  const handleColumnEditShow = (status) => {
    document.removeEventListener("click", detectBlur);
    if (status) {
      document.addEventListener("click", detectBlur);
    }
    setIsColumnEdit(status);
  };

  const detectBlur = (event) => {
    const popover = document.querySelector(".table-column-available-box");
    let targetElement = event.target; // clicked element

    do {
      if (targetElement === popover) {
        // This is a click inside. Do nothing, just return.
        return;
      }
      // Go up the DOM
      targetElement = targetElement.parentNode;
    } while (targetElement);

    // This is a click outside.
    handleColumnEditShow(false);
  };

  const columns = table.getAllLeafColumns().map((column) => {
    let label = column.id;
    if (typeof column.columnDef?.header === "string") {
      label = column.columnDef?.header;
    } else if (column.columnDef?.header?.props?.children) {
      label = column.columnDef?.header?.props?.children;
    } else if (column.columnDef?.HeaderLabel) {
      label = column.columnDef?.HeaderLabel;
    }

    return (
      <CustomCheckbox
        key={`${column.id}`}
        onChange={column.getToggleVisibilityHandler()}
        checked={column.getIsVisible()}
        labelText={label}
      />
    );
  });

  return (
    <>
      <Button
        className={"table-column-available-button react-table-8-column-button"}
        id={id?.current}
        size="sm"
        outline
        style={style}
        onClick={() => handleColumnEditShow(!isColumnEdit)}
      >
        <i className="iconfont icon-bars" />
      </Button>
      {isColumnEdit && (
        <Popover
          className={"table-column-available-box"}
          target={id.current}
          placement={placement || "left"}
          isOpen={isColumnEdit}
        >
          <PopoverBody>
            {columns}
            <Button size="sm" outline onClick={() => handleColumnEditShow(false)}>
              {locale.COMMON_CONFIRM}
            </Button>
          </PopoverBody>
        </Popover>
      )}
    </>
  );
};

export default ReactTable8ColumnVisibility;
