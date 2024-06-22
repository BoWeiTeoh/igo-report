import React, { useEffect, useState } from "react";
import showToast from "../../../helpers/showToast.js";
import dataSource from "../../../dataSource/dataSource.js";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Select from "../../../components/b2Select/b2Select.jsx";
import { constFilterType } from "../../../components/tableFilter/constFilter.js";
import {
  getCategoriesBySiteType,
  getPlatformByRole,
  getSiteTypeByBranch,
  getSupplierByCategory
} from "../../../common/common.js";

const DEFAULT_STATE = {
  _id: null,
  branches: []
};

const ModalRoleBranch = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  const [branch, setBranch] = useState([]);
  const [siteType, setSiteType] = useState([]);
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [currentBranch, setCurrentBranch] = useState([]);
  const [currentSiteType, setCurrentSiteType] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState([]);

  useEffect(() => {
    getPlatform().catch();
  }, []);

  useEffect(() => {
    if (data) {
      setState((d) => ({
        ...d,
        ...data
      }));
    }
    let currentBranchList = [];
    let currentSiteTypeList = [];
    let currentCategoryList = [];
    let currentSupplierList = [];

    for (let i = 0; i < data?.branches?.length; i++) {
      currentBranchList.push({
        label: data?.branches[i]?.name,
        value: data?.branches[i]?._id
      });
    }
    setCurrentBranch(currentBranchList);

    for (let i = 0; i < data?.siteTypes?.length; i++) {
      currentSiteTypeList.push({
        label: data?.siteTypes[i]?.name,
        value: data?.siteTypes[i]?._id
      });
    }
    setCurrentSiteType(currentSiteTypeList);

    for (let i = 0; i < data?.categories?.length; i++) {
      currentCategoryList.push({
        label: data?.categories[i]?.name,
        value: data?.categories[i]?._id
      });
    }
    setCurrentCategory(currentCategoryList);

    for (let i = 0; i < data?.suppliers?.length; i++) {
      currentSupplierList.push({
        label: data?.suppliers[i]?.name,
        value: data?.suppliers[i]?._id
      });
    }
    setCurrentSupplier(currentSupplierList);

  }, [data]);

  useEffect(() => {
    const platformArr = branch.map((item) => item?.value);
    getSiteTypeByBranch({ _id: platformArr }, setSiteType).catch();
  }, [branch]);

  useEffect(() => {
    const siteTypeArr = siteType.map((item) => item?.value);
    getCategoriesBySiteType({ _id: siteTypeArr }, setCategory).catch();
  }, [siteType]);

  useEffect(() => {
    const categoryArr = category.map((item) => item?.value);
    getSupplierByCategory({ _id: categoryArr }, setSupplier).catch();
  }, [category]);

  const handleModalClose = () => {
    setState(DEFAULT_STATE);
    onClose();
  };

  const handleResourceSave = async () => {
    try {
      let response;
      let query = {
        _id: state?._id,
        branches: state?.branches,
        siteTypes: state?.siteTypes,
        categories: state?.categories,
        suppliers: state?.suppliers
      };

      response = await dataSource.shared?.updateRoleBranches(query);
      showToast(response);
      setState(DEFAULT_STATE);
      onDataUpdate();
      onClose();
    } catch (e) {
      showToast(e);
    }
  };

  const handleSelectChange = (selectData, queryKey) => {
    switch (queryKey){
      case "branches": {
        const platformArr = selectData.map((item) => item?.value);
        getSiteTypeByBranch({ _id: platformArr }, setSiteType).catch();
        onClearSiteType().catch();
        onClearCategory().catch();
        onClearSupplier().catch();
        break;
      }
      case "siteTypes": {
        const siteTypeArr = selectData.map((item) => item?.value);
        getCategoriesBySiteType({ _id: siteTypeArr }, setCategory).catch();
        onClearCategory().catch();
        onClearSupplier().catch();
        break;
      }
      case "categories": {
        const categoryArr = selectData.map((item) => item?.value);
        getSupplierByCategory({ _id: categoryArr }, setSupplier).catch();
        onClearSupplier().catch();
        break;
      }
    }
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

  const onClearSiteType = async () => {
    setCurrentSiteType([]);
    setState((d) => {
      return {
        ...d,
        ["siteTypes"]: []
      };
    });
  }

  const onClearCategory = async () => {
    setCurrentCategory([]);
    setState((d) => {
      return {
        ...d,
        ["categories"]: []
      };
    });
  }

  const onClearSupplier = async () => {
    setCurrentSupplier([]);
    setState((d) => {
      return {
        ...d,
        ["suppliers"]: []
      };
    });
  }

  const getPlatform = async (query = {}) => {
    getPlatformByRole({}, setBranch).catch();
  };


  return (
    <B2Modal title={"Role Branch : " + state?.roleName} className={"b2form"} isCentre={true}
             isOpen={isOpen}
             onConfirm={handleResourceSave} onClose={handleModalClose}>
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Outlet ID</label>
            <B2Select
              options={branch}
              queryKey={"branches"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={currentBranch}
              onChange={(e) => handleSelectChange(e, "branches")}
              isMulti={true}
            />
          </div>
          <div>
            <label>Site Types</label>
            <B2Select
                options={siteType}
                queryKey={"siteTypes"}
                type={constFilterType.select}
                placeholder={" "}
                className={"creatable-select"}
                value={currentSiteType}
                onChange={(e) => handleSelectChange(e, "siteTypes")}
                isMulti={true}
            />
          </div>
          <div>
            <label>Platform Code</label>
            <B2Select
                options={category}
                queryKey={"categories"}
                type={constFilterType.select}
                placeholder={" "}
                className={"creatable-select"}
                value={currentCategory}
                onChange={(e) => handleSelectChange(e, "categories")}
                isMulti={true}
            />
          </div>
          <div>
            <label>Game Brand</label>
            <B2Select
                options={supplier}
                queryKey={"suppliers"}
                type={constFilterType.select}
                placeholder={" "}
                className={"creatable-select"}
                value={currentSupplier}
                onChange={(e) => handleSelectChange(e, "suppliers")}
                isMulti={true}
            />
          </div>
        </div>
      </div>
    </B2Modal>
  );
};

export default ModalRoleBranch;
