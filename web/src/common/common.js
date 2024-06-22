import dataSource from "../dataSource/dataSource.js";

const getPlatformByRole = async (query, setPlatform) => {
  const response = await dataSource.shared?.getPlatformByRole(query);
  let platformList = [];
  for (let i = 0; i < response?.data?.length; i++) {
    platformList.push({
      label: response?.data[i]?.name,
      value: response?.data[i]?._id
    });
  }

  setPlatform(platformList);
};

const getCategoriesBySiteType = async (query, setCategory) => {
  const response = await dataSource.shared?.getCategoriesBySiteType(query);
  let categoryList = [];
  for (let i = 0; i < response?.data?.length; i++) {
    categoryList.push({
      label: response?.data[i]?.name,
      value: response?.data[i]?._id
    });
  }

  setCategory(categoryList);
};

const getSiteTypeByBranch = async (query, setSiteType) => {
  const response = await dataSource.shared?.getSiteTypeByBranch(query);
  let siteTypeList = [];
  for (let i = 0; i < response?.data?.length; i++) {
    siteTypeList.push({
      label: response?.data[i]?.name,
      value: response?.data[i]?._id
    });
  }
  await setSiteType(siteTypeList);
};

const getSiteTypeByBranchWithId = async (query, setSiteType) => {
  const response = await dataSource.shared?.getSiteTypeByBranchWithId(query);
  const uniqueNames = new Set();
  let siteTypeList = [];
  for (let i = 0; i < response?.data?.length; i++) {
    const name = response?.data[i]?.categoryId?.name;
    const value = response?.data[i]?.categoryId?._id;
    const branchId = response?.data[i]?._id;


    if (!uniqueNames.has(name)) {
      siteTypeList.push({ label: name, value, branchId });
      uniqueNames.add(name);
    }
  }

  await setSiteType(siteTypeList);
};

const getSupplierByCategory = async (query, setSupplier) => {
  const response = await dataSource.shared?.getSupplierByCategory(query);
  let supplierList = [];
  for (let i = 0; i < response?.data?.length; i++) {
    supplierList.push({
      label: response?.data[i]?.providerId + ". " + response?.data[i]?.name,
      value: response?.data[i]?._id
    });
  }

  setSupplier(supplierList);
};

const getGame = async (query, setGame) => {
  const response = await dataSource.shared?.getGameName(query);
  let gameList = [];
  for (let i = 0; i < response?.data?.length; i++) {
    gameList.push({
      label: response?.data[i],
      value: response?.data[i]
    });
  }
  setGame(gameList);
};

export { getPlatformByRole, getCategoriesBySiteType,getSiteTypeByBranchWithId, getSiteTypeByBranch, getSupplierByCategory, getGame };