import { memo, useEffect } from "react";
import LocateModalFolderStructure from "./LocateModalFolderStructure";

const LocateModal = ({ data, locateModalVisible, closeLocateModal }) => {
    useEffect(() => {
        if (locateModalVisible) document.getElementById("LocateCloseButton").focus();
    }, [locateModalVisible]);

    return (
        <>
            <div
                className="LocateTab"
                id="LocateTab"
                style={locateModalVisible ? { display: "block" } : { display: "none" }}
            >
                <div className="LocateBox" id="LocateBox">
                    {locateModalVisible && <LocateModalFolderStructure data={data} />}
                </div>

                <button
                    className="LocateCloseButton"
                    id="LocateCloseButton"
                    onMouseDown={(e) => closeLocateModal(e)}
                    onKeyPress={(e) => closeLocateModal(e)}
                >
                    Close
                </button>
            </div>
        </>
    );
};
export default memo(LocateModal);
