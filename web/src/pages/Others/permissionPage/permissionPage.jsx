import React, { useEffect, useState } from "react";
import BasePage from "../basePage/basePage.jsx";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";
import B2Button from "../../../components/b2Button/b2Button.jsx";

const PermissionPage = (props) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData().then();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dataSource.shared?.getAllPermission();
      setList(response?.data);
    } catch (e) {
      showToast(e);
    }
  };

  const handleGeneratePermissionClick = async () => {
    try {
      await dataSource.shared?.generatePermissions();
      fetchData().then();
      showToast("ok");
    } catch (e) {
      showToast(e);
    }
  };

  return (
    <BasePage {...props} title={null}>
      <B2Button onClick={handleGeneratePermissionClick} size={"sm"}>
        Generate Permissions
      </B2Button>
      <div style={{ padding: 20 }}>
        {list?.map((d) => {
          return (
            <div key={d._id}>
              <h6>
                {d._id}-{d.name}
              </h6>
              <div>
                {d.permissions?.map((p) => {
                  return (
                    <div key={p._id}>
                      {p._id}-{p.name}
                    </div>
                  );
                })}
              </div>
              <br />
            </div>
          );
        })}
      </div>
    </BasePage>
  );
};

export default PermissionPage;
