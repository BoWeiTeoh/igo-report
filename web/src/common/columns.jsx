import { toDecimalString, formatDecimal } from "../helpers/util_number.js";
import { getDateTzISOString } from "../helpers/util_datetime.js";
import React, {useState} from "react";
import Switch from "react-switch";
import B2Button from "../components/b2Button/b2Button.jsx";
import B2ButtonGroup from "../components/b2ButtonGroup/b2ButtonGroup.jsx";
import B2Card from "../components/b2Card/b2Card.jsx"; // Assuming B2Card is correctly imported
import ic_branch from "../images/icon/ic_branch work.png";
import ic_authoritys from "../images/icon/ic_authoritys.png";
import ic_reset from "../images/icon/ic_reset.png";
import ic_edit from "../images/icon/ic_edit.png";
import ic_delete from "../images/icon/ic_delete.png";
import ic_running from "../images/icon/running.png";
import ic_disable from "../images/icon/Disable.png";
import ic_maintenance from "../images/icon/maintenance.png";
import ic_unavailable from "../images/icon/unavailable.png";
import { Label, UncontrolledTooltip } from "reactstrap";
import B2Image from "../components/b2Image/b2Image.jsx";
import { constPlayerCreditTransferStatus } from "../components/tableFilter/constFilter.js";
import constGameStatus from "../const/constGameStatus.js";

const getColumns = (columnsArr, handleModalOpen, handleModelSwitch) => {
  let returnArr;
  returnArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      // adminManage
      case "id": {
        returnData = {
          header: "ID",
          accessorKey: "ID"
        };
        break;
      }
      case "userID": {
        returnData = {
          header: "ID",
          accessorKey: "userID"
        };
        break;
      }
      case "username": {
        returnData = {
          header: "Username",
          accessorKey: "username"
        };
        break;
      }
      case "role": {
        returnData = {
          header: "Role Name",
          cell: ({ row }) => {
            const { roles } = row?.original || {};
            return roles?.isDelete ? (
              <div className={"text-danger"}>{roles?.roleName}</div>
            ) : (
              <div>{roles?.roleName}</div>
            );
          }
        };
        break;
      }
      case "creator": {
        returnData = {
          header: "Creator",
          cell: ({ row }) => {
            const { creator } = row?.original || {};
            return <div>{creator?.username}</div>;
          }
        };
        break;
      }
      case "createdAt": {
        returnData = {
          header: "Create Time",
          cell: ({ row }) => {
            const { createdAt } = row?.original || {};
            return <div>{getDateTzISOString(createdAt)}</div>;
          }
        };
        break;
      }
      case "updater": {
        returnData = {
          header: "Updater",
          cell: ({ row }) => {
            const { updater } = row?.original || {};
            return <div>{updater?.username}</div>;
          }
        };
        break;
      }
      case "updatedAt": {
        returnData = {
          header: "Update Time",
          cell: ({ row }) => {
            const { updatedAt } = row?.original || {};
            return <div>{getDateTzISOString(updatedAt)}</div>;
          }
        };
        break;
      }
      case "remark": {
        returnData = {
          header: "Remark",
          accessorKey: "remark"
        };
        break;
      }
      case "state": {
        returnData = _createStateData(handleModelSwitch);
        break;
      }
      case "operate": {
        returnData = _createOperateData(handleModalOpen, item?.actions);
        break;
      }

      // branch
      case "branch3": {
        returnData = {
          header: "Outlet ID",
          accessorKey: "name"
        };
        break;
      }
      case "siteType2": {
        returnData = {
          header: "Site Type",
          cell: ({ row }) => {
            let { siteType } = row?.original || {};
            return (
              <>
                {siteType.map(({ name, _id }) => (
                  <li key={_id}>{name}</li>
                ))}
              </>
            );
          }
        };
        break;
      }

      // category
      case "category2": {
        returnData = {
          header: "Platform Code",
          accessorKey: "name"
        };
        break;
      }
      case "supplier3": {
        returnData = {
          header: "Game Brand",
          cell: ({ row }) => {
            let { supplier } = row?.original || {};
            return (
              <>
                {supplier.map(({ name, providerId }) => (
                  <li key={providerId}>{providerId + ". " + name}</li>
                ))}
              </>
            );
          }
        };
        break;
      }

      // siteType
      case "siteType3": {
        returnData = {
          header: "Site Type",
          accessorKey: "name"
        };
        break;
      }
      case "category3": {
        returnData = {
          header: "Platform Code",
          cell: ({ row }) => {
            let { category } = row?.original || {};
            return (
              <>
                {category.map(({ name, _id }) => (
                  <li key={_id}>{name}</li>
                ))}
              </>
            );
          }
        };
        break;
      }

      //system config
      case "_id": {
        returnData = {
          header: "ID",
          accessorKey: "id"
        };
        break;
      }
      case "configType": {
        returnData = {
          header: "Config Type",
          accessorKey: "configType"
        };
        break;
      }
      case "config": {
        returnData = {
          header: "Config",
          cell: ({ row }) => {
            let { config } = row?.original || {};
            switch (config) {
              case "$gte":
                return <div>{"greater and equal than "}</div>;
              case "$gt":
                return <div>{"greater than "}</div>;
              case "$lte":
                return <div>{"lower or equal than"}</div>;
              case "$lt":
                return <div>{"lower than"}</div>;
              default:
                return <div>{config}</div>;
            }
          }
        };
        break;
      }
      case "detail": {
        returnData = {
          header: "Detail",
          accessorKey: "detail"
        };
        break;
      }
      case "branch": {
        returnData = {
          header: "Outlet ID",
          accessorKey: "branch"
        };
        break;
      }

      //ip Config ipAddress
      case "ipAddress": {
        returnData = {
          header: "IP Address",
          accessorKey: "ipAddress"
        };
        break;
      }
      // role
      case "role2": {
        returnData = {
          header: "Role",
          accessorKey: "roleName"
        };
        break;
      }
      case "roleID": {
        returnData = {
          header: "ID",
          accessorKey: "roleID"
        };
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }

    return returnData;
  });
  return returnArr;
};

const getReportColumns = (columnsArr) => {
  let reportArr;
  reportArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      // report
      case "no": {
        returnData = {
          header: "No",
          accessorKey: "ID"
        };
        break;
      }
      case "branch": {
        returnData = {
          header: "Outlet Id",
          accessorKey: "branch"
        };
        break;
      }
      case "branch2": {
        returnData = {
          header: "Outlet Id",
          cell: ({ row }) => {
            const { platformId } = row?.original || {};
            return <div>{platformId?.name}</div>;
          }
        };
        break;
      }
      case "siteType": {
        returnData = {
          header: "Site Type",
          accessorKey: "siteType"
        };
        break;
      }
      case "category": {
        returnData = {
          header: "Platform Code",
          cell: ({ row }) => {
            const { category, total } = row?.original || {};
            if (!total) {
              return <div>{category}</div>;
            } else {
              return <h6>{"Total"}</h6>;
            }
          }
        };
        break;
      }
      case "category2": {
        returnData = {
          header: "Platform Code",
          cell: ({ row }) => {
            const { category } = row?.original || {};
            return <div>{category}</div>;
          }
        };
        break;
      }
      case "supplier": {
        returnData = {
          header: "Game Brand",
          cell: ({ row }) => {
            const { supplier, total } = row?.original || {};
            if (!total) {
              return <div>{supplier}</div>;
            } else {
              return <h6>{"Total"}</h6>;
            }
          }
        };
        break;
      }
      case "supplier2": {
        returnData = {
          header: "Game Brand",
          cell: ({ row }) => {
            const { providerId } = row?.original || {};
            return <div>{providerId?.name}</div>;
          }
        };
        break;
      }
      case "date": {
        returnData = {
          header: "Date",
          cell: ({ row }) => {
            const { betTime } = row?.original || {};
            return <div>{getDateTzISOString(betTime, null, "YYYY-MM-DD")}</div>;
          }
        };
        break;
      }
      case "bet": {
        returnData = {
          header: "Bet",
          cell: ({ row }) => {
            const { amount } = row?.original || {};
            return <div>{formatDecimal(amount, 3)}</div>;
          }
        };
        break;
      }
      case "turnover": {
        returnData = {
          header: "Turnover",
          cell: ({ row }) => {
            const { validAmount } = row?.original || {};
            return <div>{formatDecimal(validAmount, 3)}</div>;
          }
        };
        break;
      }
      case "payout": {
        returnData = {
          header: "Payout",
          cell: ({ row }) => {
            const { amount, bonusAmount } = row?.original || {};
            const payout = amount + bonusAmount;
            return <div>{formatDecimal(payout, 3)}</div>;
          }
        };
        break;
      }
      case "winLose": {
        returnData = {
          header: "Win/Lose",
          cell: ({ row }) => {
            const { bonusAmount } = row?.original || {};
            return <div>{formatDecimal(bonusAmount, 3)}</div>;
          }
        };
        break;
      }
      case "playerId": {
        returnData = {
          header: "Player ID",
          cell: ({ row }) => {
            const { playerId } = row?.original || {};
            return <div>{playerId?.playerId}</div>;
          }
        };
        break;
      }
      case "account": {
        returnData = {
          header: "Account",
          cell: ({ row }) => {
            const { playerId } = row?.original || {};
            return <div>{playerId?.name}</div>;
          }
        };
        break;
      }
      case "billNo": {
        returnData = {
          header: "Bill No",
          accessorKey: "orderNo"
        };
        break;
      }
      case "gameCode": {
        returnData = {
          header: "Game Code",
          cell: ({ row }) => {
            const { gameId } = row?.original || {};
            return <div>{gameId?.code}</div>;
          }
        };
        break;
      }
      case "billTime": {
        returnData = {
          header: "Bill Time",
          cell: ({ row }) => {
            const { createTime } = row?.original || {};
            return <div>{getDateTzISOString(createTime)}</div>;
          }
        };
        break;
      }
      case "payoutTime": {
        returnData = {
          header: "Payout Time",
          cell: ({ row }) => {
            const { settlementTime } = row?.original || {};
            return <div>{getDateTzISOString(settlementTime)}</div>;
          }
        };
        break;
      }
      case "game": {
        returnData = {
          header: "Game",
          cell: ({ row }) => {
            const { gameId, subTotal } = row?.original || {};
            if (subTotal) {
              return <h6>{"SubTotal"}</h6>;
            }
            return <div>{gameId?.regionName?.EN || gameId?.name}</div>;
          }
        };
        break;
      }
      case "betType": {
        returnData = {
          header: "Main Bet Type",
          accessorKey: "betType"
        };
        break;
      }
      case "count": {
        returnData = {
          header: "Count",
          accessorKey: "count"
        };
        break;
      }
      case "channelType": {
        returnData = {
          header: "Channel Type",
          accessorKey: "channelType"
        };
        break;
      }
      case "beforeBet": {
        returnData = {
          header: "Before Bet",
          accessorKey: "beforeBet"
        };
        break;
      }
      case "transactionType": {
        returnData = {
          header: "Transaction Type",
          accessorKey: "transactionType"
        };
        break;
      }
      case "expense": {
        returnData = {
          header: "Expense",
          accessorKey: "expense"
        };
        break;
      }
      case "income": {
        returnData = {
          header: "Income",
          accessorKey: "income"
        };
        break;
      }
      case "runningBalance": {
        returnData = {
          header: "Running Balance",
          accessorKey: "runningBalance"
        };
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }

    return returnData;
  });

  return reportArr;
};

const getOtherColumns = (columnsArr) => {
  let reportArr;
  reportArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      case "link": {
        returnData = {
          header: "Link",
          accessorKey: "link"
        };
        break;
      }
      case "status": {
        returnData = {
          header: "Status",
          accessorKey: "status"
        };
        break;
      }
      case "aws": {
        returnData = {
          header: "AWS",
          accessorKey: "awsUpdateTime"
        };
        break;
      }
      case "time": {
        returnData = {
          header: "Approximate Time",
          accessorKey: "time"
        };
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }

    return returnData;
  });

  return reportArr;
};

const getPlayerColumns = (columnsArr, handleModalOpen) => {
  let reportArr;
  reportArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      case "ID": {
        returnData = {
          header: "Player ID",
          cell: ({row}) => {
            const {playerId, data} = row?.original || {};
            return playerId || data?.playerObjId?.playerId;
          }
        };
        break;
      }
      case "name": {
        returnData = {
          header: "Name",
          cell: ({row}) => {
            const {name, data} = row?.original || {};
            return name || data?.playerObjId?.name || data?.playerName;
          }
        };
        break;
      }
      case "validCredit": {
        returnData = {
          header: "Credit",
          cell: ({row}) => {
            const {validCredit} = row?.original || {};
            return <div>{toDecimalString(validCredit, 2, false, true)}</div>;
          }
        };
        break;
      }
      case "amount": {
        returnData = {
          header: "Amount",
          cell: ({row}) => {
            let {amount, data} = row?.original || {};
            amount = amount || data?.amount || 0;
            return <div>{toDecimalString(amount, 2, false, true)}</div>;
          }
        };
        break;
      }
      case "createTime": {
        returnData = {
          header: "Create Time",
          cell: ({row}) => {
            const {createTime} = row?.original || {};
            return <div>{getDateTzISOString(createTime)}</div>;
          }
        };
        break;
      }
      case "status": {
        returnData = {
          header: "status",
          accessorKey: "status"
        };
        break;
      }
      case "transferInOutStatus": {
        returnData = {
          header: "status",
          accessorKey: "status",
          cell: ({row}) => {
            const {status} = row?.original || {};
            const statusValue = _mapTransferStatusToLabel(status);
            return <div>{statusValue}</div>;
          }
        };
        break;
      }
      case "proposalId": {
        returnData = {
          header: "proposalId",
          accessorKey: "proposalId"
        }
        break;
      }
      case "playerName": {
        returnData = {
          header: "Name",
          accessorKey: "playerName"
        }
        break;
      }
      case "providerId": {
        returnData = {
          header: "Provider Id",
          accessorKey: "providerId"
        }
        break;
      }
      case "transferInOut": {
        returnData = {
          header: "Transfer In/Out",
          accessorKey: "type"
        }
        break;
      }
      case "registrationTime": {
        returnData = {
          header: "Registration Time",
          cell: ({row}) => {
            const {registrationTime} = row?.original || {};
            return <div>{getDateTzISOString(registrationTime)}</div>;
          }
        }
        break;
      }
      case "isCompleteInfo": {
        returnData = {
          header: "isCompleteInfo (KYC)",
          accessorKey: "isCompleteInfo"
        }
        break;
      }
      case "playerInformation": {
        returnData = {
          header: "Player Information",
          cell: ({row}) => {
            return (
                <B2ButtonGroup>
                  <B2Button
                      color="primary"
                      size={"sm"}
                      type="submit"
                      onClick={() => handleModalOpen("detail", row?.original)}
                      id={`tooltip-delete-${row?.index}`}
                      outline
                  >
                    Detail
                  </B2Button>
                </B2ButtonGroup>
            );
          },
        }
        break;
      }
      case "picture": {
        returnData = {
          header: "Picture",
          cell: ({row}) => {
            return (
                <B2ButtonGroup>
                  <B2Button
                      color="primary"
                      size={"sm"}
                      type="submit"
                      onClick={() => handleModalOpen("picture", row?.original)}
                      id={`tooltip-delete-${row?.index}`}
                      outline
                  >
                    Picture
                  </B2Button>
                </B2ButtonGroup>
            );
          },
        }
        break;
      }
      case "playerStatus": {
        returnData = {
          header: "Disable/Enable",
          cell: ({ row }) => {
            let { status, _id } = row?.original || {};
            const [isChecked, setIsChecked] = useState(true);
            return (
                <label>
                  <Switch
                      onChange={() => setIsChecked(!isChecked)}
                      checked={isChecked}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={22}
                      width={50}
                      onColor="#25E0FF"
                  />
                </label>
            );
          },
        }
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }

    return returnData;
  });

  return reportArr;
};

const getDashboardColumns = (columnsArr) => {
  let returnArr;
  returnArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      case "game": {
        returnData = {
          header: "Games",
          cell: ({ row }) => {
            const gameArr = row?.original;
            const iconMap = {
              [constGameStatus.ENABLE]: ic_running,
              [constGameStatus.DISABLE]: ic_disable,
              [constGameStatus.MAINTENANCE]: ic_maintenance
            };
            const cards = gameArr.map((game, index) => {
              let icon = iconMap[game.status] || ic_unavailable;

              return (
                  <B2Card key={index} className={`game-card`} title={game?.game?.regionName?.EN}>
                    <img src={game?._imageURL} className="game-image" alt="game"/>
                    <div className="game-details">
                      <B2Image
                          src={icon}
                          alt="game-status-icon"
                          className="status-icon"
                          isIcon={true}
                      />
                      <label className="game-description">{game?.game?.regionName?.EN}</label>
                    </div>
                  </B2Card>
              );
            });

            return <div className="game-container">{cards}</div>;
          }
        };
        break;
      }
      case "supplier": {
        returnData = {
          header: "Supplier",
          cell: ({row}) => {
            let supplierArr = row?.original;

            const buttons = supplierArr.map((supplier, index) => {
              let classStyle
              let colorStyle;
              switch (supplier.status) {
                case constGameStatus.ENABLE:
                  classStyle = "successCls";
                  break;
                case constGameStatus.DISABLE:
                  colorStyle = "danger";
                  break;
                case constGameStatus.MAINTENANCE:
                  colorStyle = "warning";
                  break;
                default:
                  colorStyle = "secondary";
              }

              return (
                  <B2Button id={`tooltip-branch-${supplier?.providerId}`} className={`dashboard ${classStyle}`} onClick={() => {}} key={index} color={colorStyle} type="submit" withShadow>
                    {supplier.name.length > 10 ? `${supplier.name.substring(0, 10)} ...` : supplier.name}
                       <UncontrolledTooltip
                          placement="top"
                          target={`tooltip-branch-${supplier?.providerId}`}>
                        {supplier.name}
                      </UncontrolledTooltip>
                  </B2Button>
              );
            });

            return <>{buttons}</>;
          },
        };
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }

    return returnData;
  });
  return returnArr;
};

const getConfigColumns = (columnsArr, handleModalOpen) => {
  let returnArr;
  returnArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      case "setting": {
        returnData = {
          header: "Setting",
          accessorKey: "setting",
        };
        break;
      }
      case "value": {
        returnData = {
          header: "Value",
          accessorKey: "value",
        };
        break;
      }
      case "operate": {
        returnData = _createOperateData(handleModalOpen, item?.actions);
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }

    return returnData;
  });
  return returnArr;
};

const getJackpotColumns = (columnsArr, handleModalOpen) => {
  let reportArr;
  reportArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      case "gameCode": {
        returnData = {
          header: "Game Code",
          accessorKey: "gameCode",
        };
        break;
      }
      case "platform": {
        returnData = {
          header: "Outlet ID",
          accessorKey: "platformName",
        };
        break;
      }
      case "totalBetAmount": {
        returnData = {
          header: "Total Bet Amount",
          accessorKey: "totalBetAmount"
        };
        break;
      }
      case "jackpotIncrement": {
        returnData = {
          header: "Jackpot Increment for each round",
          accessorKey: "jackpotAmountForGameRound"
        };
        break;
      }
      case "totalJackpotAmount": {
        returnData = {
          header: "Total Jackpot Amount",
          accessorKey: "totalJackpotAmount"
        };
        break;
      }
      case "grandJackpotIncrement": {
        returnData = {
          header: "Grand Jackpot Increment for each round",
          accessorKey: "grandJackpotAmountForGameRound"
        };
        break;
      }
      case "grandJackpotAmount": {
        returnData = {
          header: "Grand Jackpot Amount",
          accessorKey: "grandJackpotAmount"
        };
        break;
      }
      case "majorJackpotIncrement": {
        returnData = {
          header: "Major Jackpot Increment for each round",
          accessorKey: "majorJackpotAmountForGameRound"
        };
        break;
      }
      case "majorJackpotAmount": {
        returnData = {
          header: "Major Jackpot Amount",
          accessorKey: "majorJackpotAmount"
        };
        break;
      }
      case "minorJackpotIncrement": {
        returnData = {
          header: "Minor Jackpot Increment for each round",
          accessorKey: "minorJackpotAmountForGameRound"
        };
        break;
      }
      case "minorJackpotAmount": {
        returnData = {
          header: "Minor Jackpot Amount",
          accessorKey: "minorJackpotAmount"
        };
        break;
      }
      case "type": {
        returnData = {
          header: "Jackpot Type",
          accessorKey: "jackpotType"
        };
        break;
      }
      case "payout": {
        returnData = {
          header: "Payout",
          accessorKey: "payout"
        };
        break;
      }
      case "jackpotPayout": {
        returnData = {
          header: "Jackpot Payout",
          accessorKey: "jackpotPayout"
        };
        break;
      }
      case "seedAmount": {
        returnData = {
          header: "Jackpot Seed Amount",
          accessorKey: "initialJackpotAmount"
        };
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }
    return returnData;
  });

  return reportArr;
};

const getAmlaColumns = (columnsArr, handleModalOpen) => {
  let reportArr;
  reportArr = columnsArr.map((item) => {
    let returnData = {};
    switch (item?.header) {
      case "date": {
        returnData = {
          header: "Date",
          accessorKey: "date",
        };
        break;
      }
      case "time": {
        returnData = {
          header: "Time",
          accessorKey: "time"
        };
        break;
      }
      case "account": {
        returnData = {
          header: "Account",
          accessorKey: "playerName"
        };
        break;
      }
      case "playerName": {
        returnData = {
          header: "Player Name",
          accessorKey: "playerName"
        };
        break;
      }
      case "transactionDetails": {
        returnData = {
          header: "Transaction Details",
          accessorKey: "transactionDetails"
        };
        break;
      }
      case "proposal": {
        returnData = {
          header: "Proposal",
          accessorKey: "proposal"
        };
        break;
      }
      case "amount": {
        returnData = {
          header: "Amount",
          accessorKey: "amount"
        };
        break;
      }
      case "source": {
        returnData = {
          header: "Source of funds",
          accessorKey: "source"
        };
        break;
      }
      case "cashier": {
        returnData = {
          header: "Cashier",
          accessorKey: "cashier"
        };
        break;
      }
      case "supervisor": {
        returnData = {
          header: "Supervisor",
          accessorKey: "supervisor"
        };
        break;
      }
    }

    if (item?.size) {
      returnData.minSize = item.size;
    }
    return returnData;
  });

  return reportArr;
};

const _mapTransferStatusToLabel = (value) => {
  const statusObject = constPlayerCreditTransferStatus.find(
    (status) => status.value === value,
  );
  return statusObject ? statusObject.label : "Unknown";
};

const _createStateData = (handleModelSwitch) => {
  return {
    header: "State",
    cell: ({ row }) => {
      let { state, _id } = row?.original || {};
      let updateData = {
        ...row?.original,
        state: !state,
        _id: _id,
      };
      return (
        <label>
          <Switch
            onChange={() => handleModelSwitch(updateData)}
            checked={state}
            uncheckedIcon={false}
            checkedIcon={false}
            height={25}
            width={50}
            onColor="#25E0FF"
          />
        </label>
      );
    },
  };
};

const _createOperateData = (handleModalOpen, actions) => {
  return {
    header: "Operate",
    cell: ({ row }) => {
      return (
        <B2ButtonGroup>
          {actions.includes("branch") && (
            <B2Button
              color="none"
              size={"sm"}
              type="submit"
              onClick={() => handleModalOpen("branch", row?.original)}
              id={`tooltip-branch-${row?.index}`}
            >
              <B2Image
                src={ic_branch}
                alt="ic_branch"
                className="image-icon-operate"
                isIcon={true}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-branch-${row?.index}`}
              >
                Branch
              </UncontrolledTooltip>
            </B2Button>
          )}
          {actions.includes("authority") && (
            <B2Button
              color="none"
              size={"sm"}
              type="submit"
              onClick={() => handleModalOpen("authority", row?.original)}
              id={`tooltip-authority-${row?.index}`}
            >
              <B2Image
                src={ic_authoritys}
                alt="ic_authoritys"
                className="image-icon-operate"
                isIcon={true}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-authority-${row?.index}`}
              >
                Authority
              </UncontrolledTooltip>
            </B2Button>
          )}
          {actions.includes("reset") && (
            <B2Button
              color="none"
              size={"sm"}
              type="submit"
              onClick={() => handleModalOpen("reset", row?.original)}
              id={`tooltip-reset-${row?.index}`}
            >
              <B2Image
                src={ic_reset}
                alt="ic_reset"
                className="image-icon-operate"
                isIcon={true}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-reset-${row?.index}`}
              >
                Reset
              </UncontrolledTooltip>
            </B2Button>
          )}
          {actions.includes("edit") && (
            <B2Button
              color="none"
              size={"sm"}
              type="submit"
              onClick={() => handleModalOpen("edit", row?.original)}
              id={`tooltip-edit-${row?.index}`}
            >
              <B2Image
                src={ic_edit}
                alt="ic_edit"
                className="image-icon-operate"
                isIcon={true}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-edit-${row?.index}`}
              >
                Edit
              </UncontrolledTooltip>
            </B2Button>
          )}
          {actions.includes("delete") && (
            <B2Button
              color="none"
              size={"sm"}
              type="submit"
              onClick={() => handleModalOpen("delete", row?.original)}
              id={`tooltip-delete-${row?.index}`}
            >
              <B2Image
                src={ic_delete}
                alt="ic_delete"
                className="image-icon-operate"
                isIcon={true}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-delete-${row?.index}`}
              >
                Delete
              </UncontrolledTooltip>
            </B2Button>
          )}
        </B2ButtonGroup>
      );
    },
  };
};

export {
  getColumns,
  getReportColumns,
  getOtherColumns,
  getPlayerColumns,
  getDashboardColumns,
  getConfigColumns,
  getAmlaColumns,
    getJackpotColumns,
};
