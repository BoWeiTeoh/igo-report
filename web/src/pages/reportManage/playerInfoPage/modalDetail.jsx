import React, { useEffect, useState } from "react";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Col from "../../../components/grid/b2Col.jsx";
import B2Row from "../../../components/grid/b2Row.jsx";
import B2Button from "../../../components/b2Button/b2Button.jsx";
import B2ButtonGroup from "../../../components/b2ButtonGroup/b2ButtonGroup.jsx";
import { getDateTzISOString,getDateString } from "../../../helpers/util_datetime.js";
import dataSource from "../../../dataSource/dataSource.js";
import showToast from "../../../helpers/showToast.js";

const ModalDetail = ({ isOpen, onClose, data }) => {
    const [state, setState] = useState({});
    const [getPhoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        if (data) {
            setState(data);
            if (data.phoneNumber) {
                setPhoneNumber("***********");
            } else {
                setPhoneNumber("");
            }
        }
    }, [data]);

    const handleModalClose = () => {
        setState({});
        onClose();
    };

    const handleClick = async (value) => {
        try {
            if (getPhoneNumber === "***********") {
                // todo
                const res = await dataSource.shared?.getPhoneNumber({phoneNumber: value})
                setPhoneNumber(res?.data?.phoneNumber)
            } else {
                setPhoneNumber("***********")
            }
        } catch (e) {
            showToast(e, true)
        }
    }

    return (
        <B2Modal size={"xl"} title={"PLAYER DETAIL"} className={"b2form"} isCentre={true} isOpen={isOpen}>
            <B2Row>
                <B2Col>
                    <div>{"Account : "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.name}</div>
                </B2Col>
                <B2Col>
                    <div>{"Real Name : "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.realName}</div>
                </B2Col>
            </B2Row>
            <B2Row>
                <B2Col>
                    <div>{"Email : "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.email}</div>
                </B2Col>
                <B2Col>
                    <div>{"Birthday : "}</div>
                </B2Col>
                <B2Col>
                    <div>{getDateString(state?.DOB)}</div>
                </B2Col>
            </B2Row>
            <B2Row>
                <B2Col >
                    <div>{"Phone Number : "}</div>
                </B2Col>
                <B2Col>
                    <B2Row>
                        <B2Col style={{ margin: 0 }}>
                            <div>{getPhoneNumber}</div>
                        </B2Col>
                        {state?.phoneNumber && (
                            <B2Col style={{ margin: 0 }}>
                                <B2Button size={"spm"} outline onClick={() => handleClick(state.phoneNumber)}>
                                    Decrypt
                                </B2Button>
                            </B2Col>
                        )}
                    </B2Row>
                </B2Col>
                <B2Col>
                    <div>{"Place of Birth : "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.placeOfBirth}</div>
                </B2Col>
            </B2Row>
            <B2Row>
                <B2Col>
                    <div>{"Nationality : "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.nationality}</div>
                </B2Col>
                <B2Col>
                    <div>{"Nature Of Work: "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.natureOfWork}</div>
                </B2Col>
            </B2Row>
            <B2Row>
                <B2Col>
                    <div>{"Player City : "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.playerCity}</div>
                </B2Col>
                <B2Col>
                    <div>{"Player Province : "}</div>
                </B2Col>
                <B2Col>
                    <div>{state?.playerProvince}</div>
                </B2Col>
            </B2Row>

            <B2ButtonGroup>
                <B2Button className="btn-standard-1" color="secondary" onClick={handleModalClose}>
                    Close
                </B2Button>
            </B2ButtonGroup>
        </B2Modal>
    );
};

export default ModalDetail;
