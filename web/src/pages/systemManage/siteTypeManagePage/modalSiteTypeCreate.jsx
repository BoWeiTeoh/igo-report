import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import util from "../../../helpers/util_string.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";

const DEFAULT_STATE = {
  siteTypeName: ""
};

const ModalSiteTypeCreate = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));
    }
  }, [data]);

  useEffect(() => {
    getProviderList().catch();
  }, []);

  const getProviderList = async () => {
    const response = await dataSource.shared?.getCategoriesByRole();
    let categoryList = [];
    for (let i = 0; i < response?.data?.length; i++) {
      categoryList.push({
        label: response?.data[i]?.name,
        value: response?.data[i]?._id
      });
    }
    setCategory(categoryList);
  };

  const handleInputChange = (value, name) => {
    setState((d) => ({
      ...d,
      [name]: value
    }));
  };

  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      let response;
      response = await dataSource.shared?.createSiteType(state);
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
            <label>Site Type Name</label>
            <B2Input onChange={handleInputChange} name={"name"} value={state?.name} placeholder={" "} />
          </div>
          <div>
            <label>Platform Code</label>
            <B2Select
              options={category}
              queryKey={"category"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={setState}
              onChange={(e) => handleSelectChange(e, "category")}
              isMulti={true}
            />
          </div>
        </div>
      </div>
    </B2Modal>
  );
};

export default ModalSiteTypeCreate;
