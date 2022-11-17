import { memo, useEffect } from "react";

const RightClickMenu = ({
    rightClickMenuVisible,
    createTabsFromSelectedBookmarks,
    rightClickMenuDeselect,
    closeRightClickMenu,
}) => {
    return (
        <>
            <a
                class="backdrop"
                onMouseDown={(e) => closeRightClickMenu(e)}
                style={rightClickMenuVisible ? { display: "block" } : { display: "none" }}
            ></a>
            <div
                className="rightClickMenu"
                id="rightClickMenu"
                style={rightClickMenuVisible ? { display: "block" } : { display: "none" }}
            >
                <div className="rightClickMenuOption" onMouseDown={() => createTabsFromSelectedBookmarks()}>
                    Open
                </div>
                <div className="rightClickMenuOption" onMouseDown={(e) => rightClickMenuDeselect(e)}>
                    Deselect all
                </div>
            </div>
        </>
    );
};
export default memo(RightClickMenu);
