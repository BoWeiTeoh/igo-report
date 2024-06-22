export const constFilterType = {
  date: "date",
  time: "time",
  input: "input",
  select: "select",
  radio: "radio",
  checkbox: "checkbox",
  autoRefresh: "autoRefresh",
  creatableInput: "creatableInput",
  visibleMultiCheck: "visibleMultiCheck",
  hide: "hide"
};

export const constBooleanOptions = [
  { label: "true", value: true },
  { label: "false", value: false }
];

export const constStatusOptions = [
  { label: "Success", value: 'Success'},
  { label: "Approved", value: 'Approved'},
  { label: "approved", value: 'approved'},
  { label: "Approve", value: 'Approve'},
  { label: "Attempt", value: 'Attempt'},
  { label: "AutoAudit", value: 'AutoAudit'},
  { label: "BeenApproved", value: 'BeenApproved'},
  { label: "Pending", value: 'Pending'},
  { label: "PendingClaim", value: 'PendingClaim'},
  { label: "PendingConfirm", value: 'PendingConfirm'},
  { label: "PendingProcess", value: 'PendingProcess'},
  { label: "PrePending", value: 'PrePending'},
  { label: "Processing", value: 'Processing'},
  { label: "Fail", value: 'Fail'},
  { label: "Cancel", value: 'Cancel'},
  { label: "Expired", value: 'Expired'},
  { label: "Manual", value: 'Manual'},
  { label: "CsPending", value: 'CsPending'},
  { label: "NoVerify", value: 'NoVerify'},
  { label: "Recover", value: 'Recover'},
  { label: "Rejected", value: 'Rejected'},
  { label: "Sending", value: 'Sending'},
  { label: "Scheduled", value: 'Scheduled'},
  { label: "Claimed", value: 'Claimed'},
  { label: "Undetermined", value: 'Undetermined'},
];

export const constPlayerCreditTransferStatus = [
  { label: "Success", value: "1"},
  { label: "Fail", value: "2"},
  { label: "Request", value: "3"},
  { label: "Send", value: "4"},
  { label: "Time Out", value: "5"}
];

export const constPlayerCreditTransferInOut = [
  { label: "transferIn", value: "transferIn" },
  { label: "transferOut", value: "transferOut" },
  { label: "TransferIn", value: "TransferIn" },
  { label: "TransferOut", value: "TransferOut" },
  { label: "TransferInFix", value: "TransferInFix" }
];