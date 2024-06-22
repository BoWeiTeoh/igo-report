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

const ModalCategoryEdit = ({ isOpen, onClose, onDataUpdate, data }) => {
  const [state, setState] = useState(data || DEFAULT_STATE);
  const [supplier, setSupplier] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState([]);
  const [mergeSupplier, setMergeSupplier] = useState([]);
  let categoryName = state?.name || "";

  useEffect(() => {
    if (data) {
      getProviderList().catch();
      setState((d) => ({
        ...d,
        ...data
      }));

      let currentSupplierList = [];
      for (let i = 0; i < data?.supplier?.length; i++) {
        currentSupplierList.push({
          label: data?.supplier[i]?.providerId + ". " + data?.supplier[i]?.name,
          value: data?.supplier[i]?._id
        });
      }
      setCurrentSupplier(currentSupplierList);
      setMergeSupplier([...currentSupplierList, ...supplier]);
    }
  }, [data]);

  useEffect(() => {
    getProviderList().catch();
  }, []);

  const getProviderList = async () => {
    const response = await dataSource.shared?.getSuppliersByRole();
    let supplierList = [];
    for (let i = 0; i < response?.data?.length; i++) {
      supplierList.push({
        label: response?.data[i]?.providerId + ". " + response?.data[i]?.name,
        value: response?.data[i]?._id
      });
    }

    setSupplier([...supplierList]);
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
      response = await dataSource.shared?.updateCategory(state);
      await getProviderList().catch();
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
    <B2Modal title={"Edit Platform Code : " + categoryName} className={"b2form"} isCentre={true} isOpen={isOpen}
             onConfirm={handleSubmit} onClose={handleModalClose}>
      <div className="modal-form-content">
        <div className="modal-form-content-1">
          <div>
            <label>Platform Code</label>
            <B2Input onChange={handleInputChange} name={"name"} value={state?.name} placeholder={" "} />
          </div>
          <div>
            <label>Game Brand</label>
            <B2Select
              options={mergeSupplier}
              queryKey={"supplier"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={currentSupplier}
              onChange={(e) => handleSelectChange(e, "supplier")}
              isMulti={true}
            />
          </div>
        </div>
      </div>

      {/* <div>
        <label>Category Name</label>
        <B2Row>
          <B2Col md={8}>
            <B2Input onChange={handleInputChange} name={"name"}
                     value={state?.name} placeholder={" "}
            />
          </B2Col>
        </B2Row>
        <label>Supplier</label>
        <B2Row>
          <B2Col md={8}>
            <B2Select
              options={mergeSupplier}
              queryKey={"supplier"}
              type={constFilterType.select}
              placeholder={" "}
              className={"creatable-select"}
              value={currentSupplier}
              onChange={(e) => handleSelectChange(e, "supplier")}
              isMulti={true}
            />
          </B2Col>
        </B2Row>
      </div> */}
    </B2Modal>
  );
};

export default ModalCategoryEdit;
