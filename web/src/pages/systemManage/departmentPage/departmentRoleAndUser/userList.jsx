import React, { useEffect, useState } from "react";
import ReactTable8 from "../../../../components/reactTable8/reactTable8.jsx";
import showToast from "../../../../helpers/showToast.js";
import dataSource from "../../../../dataSource/dataSource.js";
import B2Input from "../../../../components/form/b2Input.jsx";
import B2Modal from "../../../../components/b2Modal/b2Modal.jsx";
import config from "../../../../config/config.js";

const UserList = ({ roleSelect, renderUserCount }) => {
  const [modal, setModal] = useState();
  const [docs, setDocs] = useState([]);
  const [paginate, setPaginate] = useState(config.paginate);

  useEffect(() => {
    fetchData().then();
  }, [roleSelect?._id, renderUserCount]);

  const fetchData = async (pagingObj = paginate) => {
    try {
      const response = await dataSource.shared?.getAdminTable(
        {
          roles: roleSelect?._id
        },
        pagingObj
      );
      setDocs(response?.data);
      setPaginate({ ...response?.pagingData });
    } catch (e) {
      showToast(e, 1);
    }
  };

  const handlePasswordUpdateClick = (userData) => {
    setModal({
      name: "updatePassword",
      data: userData
    });
  };

  const columns = getColumns({ handlePasswordUpdateClick });
  return (
    <div className="user-list">
      {/*<ReactTable8*/}
      {/*  columns={columns}*/}
      {/*  data={docs || []}*/}
      {/*  showPageInput={false}*/}
      {/*  onFetchData={fetchData}*/}
      {/*  limit={paginate?.limit}*/}
      {/*  totalCount={paginate?.totalDocs}*/}
      {/*  pages={paginate?.totalPages}*/}
      {/*/>*/}
      <ReactTable8
        columns={columns}
        data={docs || []}
        checkbox={false}
        onFetchData={fetchData}
        limit={10000}
        showPagination={false}
      />

      <ModalUpdatePassword isOpen={modal?.name === "updatePassword"} setModal={setModal} data={modal?.data} />
    </div>
  );
};

const DEFAULT_STATE = {
  newPassword: ""
};
const ModalUpdatePassword = ({ isOpen, data, setModal }) => {
  const [state, setState] = useState(DEFAULT_STATE);

  const handleInputChange = (value, name) => {
    setState((d) => ({
      ...d,
      [name]: value
    }));
  };

  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    setModal(null);
  };

  const handlePasswordUpdate = async () => {
    try {
      const response = await dataSource.shared?.updateUserPassword({
        newPassword: state?.newPassword,
        _id: data?._id
      });
      showToast(response);
    } catch (e) {
      showToast(e, 1);
    }
  };

  return (
    <B2Modal isOpen={isOpen} onConfirm={handlePasswordUpdate} onClose={handleModalClose} title={"Update Password"}>
      <B2Input
        onChange={handleInputChange}
        placeholder={"New Password"}
        name={"newPassword"}
        value={state?.newPassword}
      />
    </B2Modal>
  );
};

const getColumns = ({ handlePasswordUpdateClick }) => {
  return [
    {
      header: "Admin",
      accessorKey: "username"
    }
    // {
    //   header: "Action",
    //   cell: ({ row }) => {
    //     return (
    //       <>
    //         <B2Button onClick={() => handlePasswordUpdateClick(row?.original)} size={"sm"} color={"secondary"}>
    //           Update Password
    //         </B2Button>
    //       </>
    //     );
    //   }
    // }
  ];
};

export default UserList;
