import { memo } from "react";

const SortMenu = ({ sortMethod, sortMenuVisible, sortBookmarksByMethod, sortMenuMovement }) => {
    return (
        <>
            <table
                className="SortbtnContainer"
                id="SortbtnContainer"
                onKeyDown={(e) => sortMenuMovement(e)}
                style={sortMenuVisible ? { display: "block" } : { display: "none" }}
            >
                <button
                    id="SortbtnContainerButton0"
                    onClick={() => sortBookmarksByMethod(1)}
                    style={sortMethod.current === 1 ? { color: "#80ade9" } : {}}
                >
                    A to Z
                </button>
                <button
                    id="SortbtnContainerButton1"
                    onClick={() => sortBookmarksByMethod(2)}
                    style={sortMethod.current === 2 ? { color: "#80ade9" } : {}}
                >
                    Z to A
                </button>
                <button
                    id="SortbtnContainerButton2"
                    onClick={() => sortBookmarksByMethod(3)}
                    style={sortMethod.current === 3 ? { color: "#80ade9" } : {}}
                >
                    New to Old
                </button>
                <button
                    id="SortbtnContainerButton3"
                    onClick={() => sortBookmarksByMethod(4)}
                    style={sortMethod.current === 4 ? { color: "#80ade9" } : {}}
                >
                    Old to New
                </button>
            </table>
        </>
    );
};
export default memo(SortMenu);
