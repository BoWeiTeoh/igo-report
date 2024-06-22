const constStreamFileStatus = {
  "ABNORMAL": -2,
  "FAIL": -1,
  "PROCESSING": 1,
  "SEARCHING": 2,
  "MAPPING": 3,
  "APPENDING": 4,
  "UPLOADING": 5,
  "SUCCESS": 200
};

const constPlayerCreditTransferStatus = {
  1: 'Success',
  2: 'Fail',
  3: 'Request',
  4: 'Send',
  5: 'Time Out'
};

const constGameStatus = {
  ENABLE: 1,
  MAINTENANCE: 2,
  DISABLE: 3,
  DELETED: 4
};

module.exports = {
  constStreamFileStatus,
  constPlayerCreditTransferStatus,
  constGameStatus
};