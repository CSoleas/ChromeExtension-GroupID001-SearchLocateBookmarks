import { memo } from "react";

const SearchInput = ({ searchBookmarkList }) => {
    const selectBookmarksFoundBox = (event) => {
        if (event.key === "Tab" && event.shiftKey === false) {
            event.preventDefault();
            document.getElementById("SortedBox").focus();
            let ele1 = document.getElementsByClassName("selectedAndFocused");
            let ele2 = document.getElementsByClassName("unselectedButFocused");
            if (ele1.length > 0) ele1[0].focus();
            if (ele2.length > 0) ele2[0].focus();
        }
    };

    return (
        <>
            <input
                className="SortedInput"
                type="text"
                id="SortedInput"
                name="SortedInput"
                autocomplete="off"
                placeholder="Search.."
                onKeyDown={(e) => selectBookmarksFoundBox(e)}
                onChange={(e) => searchBookmarkList(e.target.value)}
                onFocus={(e) => e.target.select()}
                spellcheck="false"
                autoFocus
            />
        </>
    );
};
export default memo(SearchInput);
