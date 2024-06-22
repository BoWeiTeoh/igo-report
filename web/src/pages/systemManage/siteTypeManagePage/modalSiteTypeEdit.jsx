import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import util from "../../../helpers/util_string.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Input from "../../../components/form/b2Input.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";

const DEFAULT_STATE = {
  name: ""
};

const ModalSiteTypeEdit = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  const [category, setCategory] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [mergeCategory, setMergeCategory] = useState([]);
  let siteTypeName = state?.name || "";

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));

      let currentCategoryList = [];
      for (let i = 0; i < data?.category?.length; i++) {
        currentCategoryList.push({
          label: data?.category[i]?.name,
          value: data?.category[i]?._id
        });
      }
      setCurrentCategory(currentCategoryList);
      setMergeCategory([...currentCategoryList, ...category]);
    }
  }, [data]);

  useEffect(() => {
    getCategories().catch();
  }, []);

  const getCategories = async () => {
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
      response = await dataSource.shared?.updateSiteType(state);
      getCategories().catch();
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e, true);
    }
  };

  const handleSelectChange = (selectData, queryKey) => {
    let value = selectData?.value;
    if (Array.isArray(selectData)) {
      value = selectData.map(d => {
        return d?.value;
      });
    }
    setState((d) => {
      return {
        ...d,
        [queryKey]: value
      };
    });
  };

  return (
    <B2Modal title={"Edit Site Type : " + siteTypeName} className={"b2form"} isCentre={true} isOpen={isOpen}
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
              options={mergeCategory}
              queryKey={"category"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={currentCategory}
              onChange={(e) => handleSelectChange(e, "category")}
              isMulti={true}
            />
          </div>
        </div>
      </div>
    </B2Modal>
  );
};

export default ModalSiteTypeEdit;
