import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";

const DEFAULT_STATE = {
  siteType: ""
};

const ModalBranchEdit = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  const [siteType, setSiteType] = useState([]);
  const [currentSiteType, setCurrentSiteType] = useState([]);
  const [mergeSiteType, setMergeSiteType] = useState([]);

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));

      let currentSiteTypeList = [];
      for (let i = 0; i < data?.siteType?.length; i++) {
        currentSiteTypeList.push({
          label: data?.siteType[i]?.name,
          value: data?.siteType[i]?._id
        });
      }
      setCurrentSiteType(currentSiteTypeList);
      setMergeSiteType([...currentSiteTypeList, ...siteType]);
    }
  }, [data]);

  useEffect(() => {
    getSiteType().catch();
  }, []);

  const getSiteType = async () => {
    const response = await dataSource.shared?.getSiteTypeByRole();
    let siteTypeList = [];
    for (let i = 0; i < response?.data?.length; i++) {
      siteTypeList.push({
        label: response?.data[i]?.name,
        value: response?.data[i]?._id
      });
    }
    setSiteType(siteTypeList);
  };

  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      let response;
      response = await dataSource.shared?.updateBranch(state);
      getSiteType().catch();
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  const handleSelectChange = (selectData, queryKey) => {
    let value;
    if (Array.isArray(selectData)) {
      value = selectData.map(d => {
        return d?.value;
      });
    } else {
      value = selectData?.value;
    }
    setState((d) => {
      return {
        ...d,
        [queryKey]: value
      };
    });
  };

  return (
    <B2Modal title={"ADD SITE TYPE"} className={"b2form"} isCentre={true} isOpen={isOpen}
             onConfirm={handleSubmit} onClose={handleModalClose}>
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Site Type</label>
            <B2Select
              options={mergeSiteType}
              queryKey={"siteType"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={currentSiteType}
              onChange={(e) => handleSelectChange(e, "siteType")}
              isMulti={true}
            />
          </div>
        </div>
      </div>

      {/* <div>
        <label>Site Type</label>
        <B2Row>
          <B2Col md={10}>
            <B2Select
              options={mergeSiteType}
              queryKey={"siteType"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={currentSiteType}
              onChange={(e) => handleSelectChange(e, "siteType")}
              isMulti={true}
            />
          </B2Col>
        </B2Row>
      </div> */}
    </B2Modal>
  );
};

export default ModalBranchEdit;
