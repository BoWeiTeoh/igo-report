const VAULT_TOKEN = process.env?.VAULT_TOKEN;
const SPRING_PROFILE = process.env?.SPRING_PROFILE;
const port = 8200;
const endpoint = "https://vault.omtools.me:" + port;
const options = {
  endpoint: endpoint,
  token: VAULT_TOKEN,
  timeout: 0.1
};
const node_vault = require("node-vault")(options);
const _ = require("lodash");
let vaultData = {};
const initial = async () => {
  return new Promise(async (resolve, reject) => {
    let timeout = setTimeout(() => {
      reject("time out");
    }, 10000);
    try {
      let profiles = SPRING_PROFILE ? process.env.SPRING_PROFILE.split(",") : [];
      let tempData = {};
      for (let i in profiles) {
        try {
          let data = await node_vault.read("secret/" + profiles[i]);
          tempData = _.merge(tempData, data);
        } catch (e) {
        }
      }
      vaultData = tempData;
      clearTimeout(timeout);
      resolve(vaultData);
    } catch (e) {
      clearTimeout(timeout);
      reject("Initial Vault Value error");
    }
  });
};
const getData = () => {
  if (vaultData?.data?.data) return vaultData?.data?.data;
  return vaultData?.data || {};
};
const vault = {
  initial: initial,
  getData: getData,
  data: {}
};
module.exports = vault;