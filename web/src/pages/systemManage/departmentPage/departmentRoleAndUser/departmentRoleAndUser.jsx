import React, {useEffect, useState} from "react";
import RoleList from "./roleList.jsx";
import UserList from "./userList.jsx";
import B2Row from "../../../../components/grid/b2Row.jsx";
import PermissionList from "../../roleManagePage/permissionList.jsx";
import B2Col from "../../../../components/grid/b2Col.jsx";
import B2Button from "../../../../components/b2Button/b2Button.jsx";
import dataSource from "../../../../dataSource/dataSource.js";
import showToast from "../../../../helpers/showToast.js";

const DepartmentRoleAndUser = ({roleList, roleSelect, onRoleSelect, onModalOpen, renderUserCount}) => {
    const [permissionUpdate, setPermissionUpdate] = useState({});

    const handleResourceSave = async () => {
        try {
            let response;
            let query = {
                role: roleSelect?._id,
                list: permissionUpdate
            };
            response = await dataSource.shared?.updateRolePermission(query);
            showToast(response);
        } catch (e) {
            showToast(e);
        }
    };

    return (
        <div>
            <RoleList list={roleList} roleSelect={roleSelect} onRoleSelect={onRoleSelect}/>
            {roleSelect && (
                <div>
                    <B2Row>
                        <B2Col className={"_user-list"} lg={6} md={12}>
                            <div className={"whitebox fullheight"}>
                                <div className={"row-h role-header"}>
                                </div>
                                <div className={"_body"}>
                                    <UserList roleSelect={roleSelect} renderUserCount={renderUserCount}/>
                                </div>
                            </div>
                        </B2Col>
                        <B2Col className={"_permission-list"} lg={6} md={12}>
                            <div className={"whitebox fullheight"}>
                                <div className={"_header"}>
                                    <div className={"fw-bold"}>Permissions</div>
                                </div>
                                <div className={"_body"}>
                                    <PermissionList roleSelect={roleSelect} setPermissionUpdate={setPermissionUpdate}/>
                                </div>
                                <div className={"_footer"}>
                                    <B2Button onClick={handleResourceSave} className="modal-confirm">
                                        {"Confirm"}
                                    </B2Button>
                                </div>
                            </div>
                        </B2Col>
                    </B2Row>
                </div>
            )}
        </div>
    );
};

export default DepartmentRoleAndUser;
