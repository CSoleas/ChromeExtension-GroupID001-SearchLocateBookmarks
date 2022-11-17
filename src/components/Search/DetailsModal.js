import { memo, useEffect } from "react";

const DetailsModal = ({ data, detailsModalVisible, closeLocateModal }) => {
    let date = new Date(data[3]);
    let finaldate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

    useEffect(() => {
        if (detailsModalVisible) document.getElementById("DetailsModalCloseButton").focus();
    }, [detailsModalVisible]);

    return (
        <>
            <div
                className="DetailsModalFrame"
                id="DetailsModalFrame"
                style={detailsModalVisible ? { display: "block" } : { display: "none" }}
            >
                <div className="DetailsModalDate">
                    <strong>Date added: &nbsp;</strong>
                    {finaldate}
                </div>
                <div className="DetailsModalTitle">
                    <strong>Title: &nbsp;</strong>
                    {data[0]}
                </div>
                <div className="DetailsModalURL">
                    <strong>URL: &nbsp;</strong>
                    {data[2]}
                </div>
            </div>
            <button
                className="DetailsModalCloseButton"
                id="DetailsModalCloseButton"
                style={detailsModalVisible ? { display: "block" } : { display: "none" }}
                onMouseDown={(e) => closeLocateModal(e)}
                onKeyPress={(e) => closeLocateModal(e)}
            >
                Close
            </button>
        </>
    );
};

export default memo(DetailsModal);
