import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Card from "../../../components/b2Card/b2Card.jsx";
import B2CardHeader from "../../../components/b2Card/b2CardHeader.jsx";
import B2ListGroup from "../../../components/b2ListGroup/b2ListGroup.jsx";
import B2ListGroupItem from "../../../components/b2ListGroup/b2ListGroupItem.jsx";
import B2Checkbox from "../../../components/form/b2Checkbox.jsx";
import B2Row from "../../../components/grid/b2Row.jsx";
import util from "../../../helpers/util.js";
import B2Col from "../../../components/grid/b2Col.jsx";

const PermissionList = ({ roleSelect, onDataUpdate, setPermissionUpdate }) => {
  const [list, setList] = useState();
  // const [permissionSelectOri, setPermissionSelectOri] = useState([]);
  const [permissionSelects, setPermissionSelects] = useState([]);
  // const [permissionChange, setPermissionChange] = useState({});

  useEffect(() => {
    fetchData().then();
  }, []);

  useEffect(() => {
    setPermissionUpdate(permissionSelects);
  }, [permissionSelects]);

  useEffect(() => {
    setPermissionSelects(roleSelect?.permissions);
    // setPermissionSelectOri(util.object.cloneObject(roleSelect?.permissions));
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
    const { _id } = permission || {};

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
  };

  const node = list?.map((d) => {
    return (
      <B2Col md={6} key={d._id}>
        <B2Card>
          <B2CardHeader>
            <div className={"d-flex align-items-center"}>
              <div>{d.name}</div>
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