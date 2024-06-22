import React, { useEffect, useState } from "react";
import B2Modal from "../../../components/b2Modal/b2Modal.jsx";
import B2Button from "../../../components/b2Button/b2Button.jsx";
import B2ButtonGroup from "../../../components/b2ButtonGroup/b2ButtonGroup.jsx";
import B2Image from "../../../components/b2Image/b2Image.jsx";

const ModalPicture = ({ isOpen, onClose, data }) => {
    const [state, setState] = useState({});

    useEffect(() => {
        console.log(data)
        if (data) {
            setState(data);
        }
    }, [data]);

    const handleModalClose = () => {
        setState({});
        onClose();
    };

    return (
        <B2Modal size={"sm"} title={"PICTURE"} className={"b2form"} isCentre={true} isOpen={isOpen}>
            <div className={"base-page-content"}>
                <B2Image
                    src={state.image}
                />
            </div>
            <B2ButtonGroup>
                <B2Button className="btn-standard-1" color="secondary" onClick={handleModalClose}>
                    Close
                </B2Button>
            </B2ButtonGroup>
        </B2Modal>
    );
};

export default ModalPicture;
