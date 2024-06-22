const XLSX = require("xlsx");
const AWS = require("aws-sdk");
const fs = require("fs");
const vaultData = require("../vault/config");
const utilDate = require("./utilDate");
const archiver = require("archiver");
const {logger} = require("./utilPinoLogger");

AWS.config.update({
  accessKeyId: vaultData.getData()["AWS_ACCESS_KEY_ID"],
  secretAccessKey: vaultData.getData()["AWS_SECRET_ACCESS_KEY"],
  region: vaultData.getData()["AWS_REGION"]
});

const s3 = new AWS.S3();

const exportData = async (jsonData, fileName) => {
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const csvData = XLSX.utils.sheet_to_csv(ws);

  const params = {
    Bucket: vaultData.getData()["AWS_S3_BUCKET_NAME"],
    Key: fileName + ".csv",
    Body: Buffer.from(csvData, "utf8")
  };

  let response = {};
  try {
    logger.info({file: "uploading ..."});
    const data = await s3.upload(params).promise();
    response = {
      link: data.Location
    };
    logger.info({"File uploaded successfully": data.Location});
  } catch (err) {
    logger.error({"Error uploading file": err});
    throw err;
  }

  return response;
};

const createExportFile = async (fileName, headerRows, headerData) => {
  let ws = XLSX.utils.json_to_sheet([]);
  const wb = XLSX.utils.book_new();
  headerData.forEach(item => {
    XLSX.utils.sheet_add_aoa(ws, [[item.text]], { origin: item.origin });
  });
  if (headerRows?.data && headerRows?.origin) {
    XLSX.utils.sheet_add_json(ws, [headerRows?.data], { origin: headerRows?.origin, skipHeader: true });
  }
  // ws = XLSX.utils.json_to_sheet([headerRows], { skipHeader: true });
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // 指定文件夹名称
  const folderName = "export";
  const exportPath = `${folderName}/${fileName}`;

  // 确保文件夹存在
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  XLSX.writeFile(wb, exportPath);
  logger.info({"createExportFile export Path": exportPath});
};

const appendDataToXlsx = async (fileName, newData, row) => {
  try {
    fileName = fileName + ".xlsx";
    const folderName = "export";
    const exportPath = `${folderName}/${fileName}`;
    const workbook = XLSX.readFile(exportPath);
    const worksheet = workbook.Sheets["Sheet1"];
    const cellRef = XLSX.utils.encode_cell({ c: 0, r: row });
    logger.info({process: "writing.."});
    await XLSX.utils.sheet_add_aoa(worksheet, newData, { origin: cellRef });
    logger.info({process: "writing done .."});

    await XLSX.writeFile(workbook, exportPath);
  } catch (e) {
    logger.error({"appendDataToXlsx ERR": e});
  }
};

const convertDataToArray = (data, branchObj) => {
  data = data.map(item => {
    return {
      branch: branchObj?.branch,
      supplier: branchObj?.supplier,
      betTime: item?.createTime,
      rowData: [
        item?.playerId?.playerId,
        "",// branchObj?.branch,
        "",// branchObj?.siteType,
        "",// branchObj?.category,
        "",// branchObj?.supplier,
        item?.playerId?.name,
        item?.orderNo,
        item?.gameId?.code,
        utilDate.getDateTzISOString(item?.createTime),
        item?.settlementTime ? utilDate.getDateTzISOString(item?.settlementTime) : "",
        item?.gameId?.regionName?.EN || item?.gameId?.name,
        item?.amount,
        item?.validAmount
      ]
    };
  });
  return data;
};

const exportDataByFile = async (fileName) => {
  const zipFileName = fileName + ".zip";
  const folderName = "export";
  const exportPath = `${folderName}/${fileName}`;
  const zipPath = `${folderName}/${zipFileName}`;

  logger.info({"START EXPORT DATA BY FILE": fileName});

  if (!fs.existsSync(exportPath)) {
    throw new Error(`File does not exist at ${exportPath}`);
  }

  // Create a zip file
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", {
    zlib: { level: 9 } // Sets the compression level
  });
  archive.on("error", function(err) {
    throw err;
  });
  archive.pipe(output);
  archive.file(exportPath, { name: fileName });
  await archive.finalize();

  let response = {};
  try {
    logger.info({file: "uploading ..."});
    const params = {
      Bucket: vaultData.getData()["AWS_S3_BUCKET_NAME"],
      Key: zipFileName,
      Body: fs.createReadStream(zipPath)
    };
    const data = await s3.upload(params).promise();
    response = {
      link: data.Location
    };
    logger.info({"File uploaded successfully:": data.Location});
    // Check if the files exist
    if (fs.existsSync(exportPath)) {
      // If they do, attempt to delete them
      try {
        fs.unlinkSync(exportPath);
        logger.info({
          Files: "successfully deleted"});
      } catch (err) {
        logger.error({"Error deleting files:": err});
      }
    } else {
      logger.warn({Files: "do not exist"});
    }
    // Delete the zip file
    if (fs.existsSync(zipPath)) {
      try {
        fs.unlinkSync(zipPath);
        logger.info({"Zip file": "successfully deleted"});
      } catch (err) {
        logger.error({"Error deleting zip file:": err});
      }
    } else {
      logger.info({Zip: "file does not exist"});
    }
    logger.info("END", new Date());
  } catch (err) {
    logger.error({"Error uploading file:": err});
    throw err;
  }

  return response;
};

const getBucket = async (fileName) => {
  return new Promise((resolve, reject) => {
    let response = [];
    const bucketParams = { Bucket: vaultData.getData()["AWS_S3_BUCKET_NAME"], Prefix: fileName };

    s3.listObjectsV2(bucketParams, function(err, data) {
      if (err) {
        logger.error({"Error": err});
        reject(err);
      } else {
        logger.info({"Bucket Contents:": data.Contents});
        response = data.Contents;
        resolve(response);
      }
    });
  });
};

const deleteBucket = async (links) => {
  links.forEach(item => {
    const params = {
      Bucket: vaultData.getData()["AWS_S3_BUCKET_NAME"],
      Key: item.link
    };

    s3.deleteObject(params, function(err, data) {
      if (err) {
        logger.error({"Error deleting object": err});
      } else {
        logger.info({"Object deleted successfully": data});
      }
    });
  });
};

const generateExportData = async (processesData, fileName) => {
  let ws;
  let wb = XLSX.utils.book_new();

  ws = XLSX.utils.json_to_sheet(processesData, { header: [], skipHeader: true });
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const bufferData = XLSX.write(wb, { type: "buffer", bookType: "csv" });

  const folderName = "export";
  const exportPath = `${folderName}/${fileName}`;

  await fs.promises.appendFile(exportPath, bufferData);
};

module.exports = {
  exportData,
  createExportFile,
  appendDataToXlsx,
  convertDataToArray,
  exportDataByFile,
  getBucket,
  deleteBucket,
  generateExportData
};
