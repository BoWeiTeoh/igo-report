import React, { useEffect, useState } from "react";
import showToast from "../../../../helpers/showToast.js";
import dataSource from "../../../../dataSource/dataSource.js";
import B2Card from "../../../../components/b2Card/b2Card.jsx";
import B2CardHeader from "../../../../components/b2Card/b2CardHeader.jsx";
import B2ListGroup from "../../../../components/b2ListGroup/b2ListGroup.jsx";
import B2ListGroupItem from "../../../../components/b2ListGroup/b2ListGroupItem.jsx";
import B2Checkbox from "../../../../components/form/b2Checkbox.jsx";
import B2Row from "../../../../components/grid/b2Row.jsx";
import util from "../../../../helpers/util.js";
import B2Button from "../../../../components/b2Button/b2Button.jsx";
import B2Col from "../../../../components/grid/b2Col.jsx";

const PermissionList = ({ roleSelect, onDataUpdate }) => {
  const [list, setList] = useState();
  const [permissionSelectOri, setPermissionSelectOri] = useState([]);
  const [permissionSelects, setPermissionSelects] = useState([]);
  const [permissionChange, setPermissionChange] = useState({});

  useEffect(() => {
    fetchData().then();
  }, []);

  useEffect(() => {
    setPermissionSelects(roleSelect?.permissions);
    setPermissionSelectOri(util.object.cloneObject(roleSelect?.permissions));
  }, [roleSelect?.permissions]);

  const fetchData = async () => {
    try {
      const response = await dataSource.shared?.getAllPermission();
      setList(response?.data);
    } catch (e) {
      showToast(e);
    }
  };

  const handlePermissionSelect = (permission, check) => {
    const { _id, resource } = permission || {};

    setPermissionSelects((d) => {
      if (!d) {
        d = [];
      }
      const exist = d.find((p) => p._id === _id);
      if (exist) {
        d = d.filter((p) => p._id !== _id);
      } else {
        d.push(permission);
      }
      return [...d];
    });

    let isChanged, action;
    if (check === true) {
      // if the permissionID not in the ori array, mean its changed
      isChanged = !permissionSelectOri?.some((p) => p._id === _id);
      action = "add";
    }

    if (check === false) {
      isChanged = permissionSelectOri?.some((p) => p._id === _id);
      action = "remove";
    }

    setPermissionChange((d) => {
      d.addList = d.addList || [];
      d.removeList = d.removeList || [];
      d.allList = d.allList || [];
      if (action === "add") {
        if (isChanged) {
          d.addList.push(permission);
          d.allList.push(permission);
        } else {
          d.removeList = d.removeList?.filter((p) => p._id !== _id);
          d.allList = d.allList?.filter((p) => p._id !== _id);
        }
      } else if (action === "remove") {
        if (isChanged) {
          d.removeList.push(permission);
          d.allList.push(permission);
        } else {
          d.addList = d.addList?.filter((p) => p._id !== _id);
          d.allList = d.allList?.filter((p) => p._id !== _id);
        }
      }
      return { ...d };
    });
  };

  const handleResourceSave = async (role, ResourceID) => {
    try {
      const addList = permissionChange?.addList?.filter((d) => d.resource === ResourceID);
      const removeList = permissionChange?.removeList?.filter((d) => d.resource === ResourceID);
      await dataSource.shared?.updateRolePermission({ role, addList, removeList });
      onDataUpdate && onDataUpdate(roleSelect);
      showToast("Success");
      setPermissionChange({});
    } catch (e) {
      showToast(e);
    }
  };

  const node = list?.map((d) => {
    const isResourceChanged = permissionChange?.allList?.some((p) => p.resource === d.resource);
    return (
      <B2Col md={6} key={d._id}>
        <B2Card>
          <B2CardHeader>
            <div className={"d-flex align-items-center"}>
              <div>{d.name}</div>
              <div className={"d-flex ms-auto"}>
                {isResourceChanged && (
                  <B2Button size={"sm"} onClick={() => handleResourceSave(roleSelect?._id, d.resource)}>
                    Save
                  </B2Button>
                )}
              </div>
            </div>
          </B2CardHeader>
          <B2ListGroup flush>
            {d.permissions?.map((p) => {
              const permissionSelected = permissionSelects?.some((s) => s._id === p._id);
              return (
                <B2ListGroupItem key={p._id}>
                  <B2Checkbox
                    onChange={() => handlePermissionSelect(p, !permissionSelected)}
                    name={p._id}
                    checked={permissionSelected || false}
                  />{" "}
                  {p.name}
                </B2ListGroupItem>
              );
            })}
          </B2ListGroup>
        </B2Card>
      </B2Col>
    );
  });

  return <B2Row>{node}</B2Row>;
};

export default PermissionList;
