import React, { memo, useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import var_SelectedBookmarks from "./Var_selected";

const BookmarksFoundBox = ({ shownBookmarks, currentIndex, scrollRef, rightClickMenu, setRightClickMenuVisible }) => {
    const anchorIndex = useRef(-1);
    const ctrlPressed = useRef(-1);

    useEffect(() => {
        scrollRef.current.scrollToItem(1, "center");
        var_SelectedBookmarks.forEach((_, id) => {
            if (document.getElementById(id) !== null) document.getElementById(id).className = "unselected";
        });
        var_SelectedBookmarks.clear();
    }, [shownBookmarks]);

    const selectMultipleUntil = (currentRowIndex, deselect) => {
        ctrlPressed.current = false;

        if (deselect) {
            var_SelectedBookmarks.forEach((_, id) => {
                if (document.getElementById(id) !== null) document.getElementById(id).className = "unselected";
            });
            var_SelectedBookmarks.clear();
        }

        if (anchorIndex.current < currentRowIndex) {
            for (let i = anchorIndex.current; i < currentRowIndex; i++) {
                var_SelectedBookmarks.set(shownBookmarks[i].id, "selected");
                if (!!document.getElementById(shownBookmarks[i].id))
                    document.getElementById(shownBookmarks[i].id).className = "selected";
            }
        } else {
            for (let i = anchorIndex.current; i > currentRowIndex; i--) {
                var_SelectedBookmarks.set(shownBookmarks[i].id, "selected");
                if (!!document.getElementById(shownBookmarks[i].id))
                    document.getElementById(shownBookmarks[i].id).className = "selected";
            }
        }
    };

    const keyboardMovement = (event) => {
        event.preventDefault();
        let keyPressed = event.key;
        let shift = event.shiftKey;
        let ctrl = event.ctrlKey;
        let current = event.target;
        let currentID = current.id;
        let currentRowIndex = Number(current.style["top"].slice(0, -2)) / 22;
        let nextRow = current.nextElementSibling;
        let prevRow = current.previousElementSibling;

        // TAB
        if (keyPressed === "Tab" && !shift) {
            document.getElementById("sortMenuButton").focus();
            return;
        }

        if (keyPressed === "Tab" && shift) {
            document.getElementById("SortedInput").focus();
            return;
        }

        // SPACE
        if (keyPressed === " " && shift === false) {
            var_SelectedBookmarks.set(
                currentID,
                var_SelectedBookmarks.get(currentID) === "unselectedButFocused"
                    ? "selectedAndFocused"
                    : "unselectedButFocused",
            );
            current.className = var_SelectedBookmarks.get(currentID);

            anchorIndex.current = currentRowIndex;
            currentIndex.current = currentRowIndex;

            current.focus();
            return;
        }

        // NORMAL
        if (keyPressed === "ArrowDown" && nextRow && shift === false && ctrl === false) {
            event.preventDefault();
            let nextRowID = nextRow.id;

            var_SelectedBookmarks.forEach((_, id) => {
                if (document.getElementById(id) !== null) document.getElementById(id).className = "unselected";
            });
            var_SelectedBookmarks.clear();
            var_SelectedBookmarks.set(nextRowID, "selectedAndFocused");

            ctrlPressed.current = false;
            anchorIndex.current = currentRowIndex + 1;
            currentIndex.current = currentRowIndex + 1;

            current.className = "unselected";
            nextRow.className = "selectedAndFocused";

            nextRow.focus({ preventScroll: true });
            nextRow.scrollIntoView({ block: "nearest" });
            return;
        }

        if (keyPressed === "ArrowUp" && prevRow && shift === false && ctrl === false) {
            event.preventDefault();
            let prevRowID = prevRow.id;

            var_SelectedBookmarks.forEach((_, id) => {
                if (document.getElementById(id) !== null) document.getElementById(id).className = "unselected";
            });
            var_SelectedBookmarks.clear();
            var_SelectedBookmarks.set(prevRowID, "selectedAndFocused");

            ctrlPressed.current = false;
            anchorIndex.current = currentRowIndex - 1;
            currentIndex.current = currentRowIndex - 1;

            current.className = "unselected";
            prevRow.className = "selectedAndFocused";

            prevRow.focus({ preventScroll: true });
            prevRow.scrollIntoView({ block: "nearest" });
            return;
        }

        //  SHIFT
        if (keyPressed === "ArrowDown" && nextRow && shift === true && ctrl === false) {
            event.preventDefault();
            let nextRowID = nextRow.id;

            if (ctrlPressed.current || Math.abs(anchorIndex.current - currentIndex.current) > 1)
                selectMultipleUntil(currentRowIndex, true);

            if (anchorIndex.current <= currentRowIndex) {
                var_SelectedBookmarks.set(currentID, "selected");
                current.className = "selected";
            } else {
                var_SelectedBookmarks.set(currentID, "unselected");
                current.className = "unselected";
            }
            var_SelectedBookmarks.set(nextRowID, "selectedAndFocused");
            nextRow.className = "selectedAndFocused";

            currentIndex.current = currentRowIndex + 1;
            nextRow.focus({ preventScroll: true });
            nextRow.scrollIntoView({ block: "nearest" });

            return;
        }

        if (keyPressed === "ArrowUp" && prevRow && shift === true && ctrl === false) {
            event.preventDefault();
            let prevRowID = prevRow.id;

            if (ctrlPressed.current || Math.abs(anchorIndex.current - currentIndex.current) > 1)
                selectMultipleUntil(currentRowIndex, true);

            if (anchorIndex.current >= currentRowIndex) {
                var_SelectedBookmarks.set(currentID, "selected");
                current.className = "selected";
            } else {
                var_SelectedBookmarks.set(currentID, "unselected");
                current.className = "unselected";
            }
            var_SelectedBookmarks.set(prevRowID, "selectedAndFocused");
            prevRow.className = "selectedAndFocused";

            currentIndex.current = currentRowIndex - 1;
            prevRow.focus({ preventScroll: true });
            prevRow.scrollIntoView({ block: "nearest" });
            return;
        }

        // CTRL
        if (keyPressed === "ArrowDown" && nextRow && shift === false && ctrl === true) {
            event.preventDefault();
            let nextRowID = nextRow.id;

            var_SelectedBookmarks.set(
                currentID,
                current.className === "selectedAndFocused" ? "selected" : "unselected",
            );
            var_SelectedBookmarks.set(
                nextRowID,
                nextRow.className === "selected" ? "selectedAndFocused" : "unselectedButFocused",
            );

            current.className = var_SelectedBookmarks.get(currentID);
            nextRow.className = var_SelectedBookmarks.get(nextRowID);

            ctrlPressed.current = true;
            currentIndex.current = currentRowIndex + 1;

            nextRow.focus({ preventScroll: true });
            nextRow.scrollIntoView({ block: "nearest" });
            return;
        }

        if (keyPressed === "ArrowUp" && prevRow && shift === false && ctrl === true) {
            event.preventDefault();
            let prevRowID = prevRow.id;

            var_SelectedBookmarks.set(
                currentID,
                current.className === "selectedAndFocused" ? "selected" : "unselected",
            );
            var_SelectedBookmarks.set(
                prevRowID,
                prevRow.className === "selected" ? "selectedAndFocused" : "unselectedButFocused",
            );

            current.className = var_SelectedBookmarks.get(currentID);
            prevRow.className = var_SelectedBookmarks.get(prevRowID);

            ctrlPressed.current = true;
            currentIndex.current = currentRowIndex - 1;

            prevRow.focus({ preventScroll: true });
            prevRow.scrollIntoView({ block: "nearest" });
            return;
        }

        // CTRL SHIFT
        if (keyPressed === "ArrowDown" && nextRow && shift === true && ctrl === true) {
            event.preventDefault();
            let nextRowID = nextRow.id;

            if (ctrlPressed.current) selectMultipleUntil(currentRowIndex, false);

            var_SelectedBookmarks.set(currentID, "selected");
            current.className = "selected";

            var_SelectedBookmarks.set(nextRowID, "selectedAndFocused");
            nextRow.className = "selectedAndFocused";

            currentIndex.current = currentRowIndex + 1;
            nextRow.focus({ preventScroll: true });
            nextRow.scrollIntoView({ block: "nearest" });
            return;
        }

        if (keyPressed === "ArrowUp" && prevRow && shift === true && ctrl === true) {
            event.preventDefault();
            let prevRowID = prevRow.id;

            if (ctrlPressed.current) selectMultipleUntil(currentRowIndex, false);

            var_SelectedBookmarks.set(currentID, "selected");
            current.className = "selected";

            var_SelectedBookmarks.set(prevRowID, "selectedAndFocused");
            prevRow.className = "selectedAndFocused";

            currentIndex.current = currentRowIndex - 1;
            prevRow.focus({ preventScroll: true });
            prevRow.scrollIntoView({ block: "nearest" });
            return;
        }
    };

    const mouseFunct = (event) => {
        let mouseClick = event.button;
        let shift = event.shiftKey;
        let ctrl = event.ctrlKey;
        let current = event.target.parentElement;
        let currentID = current.id;
        let currentRowIndex = Number(current.style["top"].slice(0, -2)) / 22;

        // RIGHT CLICK
        if (mouseClick == "2") {
            rightClickMenu(event);
            document.getElementById("SortedBox").className = "SortedBoxFakeFocus";
        }

        // LEFT CLICK
        if (mouseClick == "0" && shift === false && ctrl === false) {
            var_SelectedBookmarks.forEach((_, id) => {
                if (document.getElementById(id) !== null) document.getElementById(id).className = "unselected";
            });
            var_SelectedBookmarks.clear();
            var_SelectedBookmarks.set(currentID, "selectedAndFocused");
            current.className = "selectedAndFocused";

            ctrlPressed.current = false;
            anchorIndex.current = currentRowIndex;
            currentIndex.current = currentRowIndex;

            current.focus();
            return;
        }

        // CTRL
        if (mouseClick == "0" && shift === false && ctrl === true) {
            let id = shownBookmarks[currentIndex.current].id;

            var_SelectedBookmarks.set(
                id,
                var_SelectedBookmarks.get(id) === "selectedAndFocused" || var_SelectedBookmarks.get(id) === "selected"
                    ? "selected"
                    : "unselected",
            );
            var_SelectedBookmarks.set(
                currentID,
                current.className === "unselected" || current.className === "unselectedButFocused"
                    ? "selectedAndFocused"
                    : "unselectedButFocused",
            );

            if (!!document.getElementById(id)) {
                document.getElementById(id).className = var_SelectedBookmarks.get(id);
            }

            current.className = var_SelectedBookmarks.get(currentID);

            ctrlPressed.current = true;
            anchorIndex.current = currentRowIndex;
            currentIndex.current = currentRowIndex;

            current.focus();
            return;
        }

        // SHIFT
        if (mouseClick == "0" && shift === true && ctrl === false) {
            var_SelectedBookmarks.forEach((_, id) => {
                if (document.getElementById(id) !== null) document.getElementById(id).className = "unselected";
            });
            var_SelectedBookmarks.clear();

            selectMultipleUntil(currentRowIndex, true);

            var_SelectedBookmarks.set(currentID, "selectedAndFocused");
            document.getElementById(currentID).className = "selectedAndFocused";

            currentIndex.current = currentRowIndex;
            return;
        }

        // SHIFT CTRL
        if (mouseClick == "0" && shift === true && ctrl === true) {
            let id = shownBookmarks[currentIndex.current].id;
            selectMultipleUntil(currentRowIndex, false);

            if (!!document.getElementById(id)) {
                document.getElementById(id).className = "selected";
                var_SelectedBookmarks.set(id, "selected");
            }

            var_SelectedBookmarks.set(currentID, "selectedAndFocused");
            document.getElementById(currentID).className = "selectedAndFocused";

            currentIndex.current = currentRowIndex;
        }
    };

    const scrollFunction = () => {
        if (document.activeElement.className === "") {
            document.getElementById("SortedBox").focus();
        }
    };

    const Row = ({ index, style, data }) => {
        let item = data[index];
        let newstyle = {
            height: style.height,
            position: style.position,
            top: style.top,
            width: shownBookmarks.length < 21 ? "398px" : "381px",
        };

        useEffect(() => {
            if (index === currentIndex.current && document.activeElement.className === "SortedBox") {
                document.getElementById(item.id).focus({ preventScroll: true });
            }
        }, []);

        return (
            <div
                className={var_SelectedBookmarks.has(item.id) ? var_SelectedBookmarks.get(item.id) : "unselected"}
                id={item.id}
                style={newstyle}
                title={item.title}
                onKeyDown={(e) => keyboardMovement(e)}
                onMouseDown={(e) => mouseFunct(e)}
                tabindex="-1"
            >
                <img
                    className="listFavicon"
                    src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.url}&size=16`}
                ></img>

                <div className="bookmarkTitle">{item.title}</div>
            </div>
        );
    };

    return (
        <List
            className="List"
            height={458}
            itemCount={shownBookmarks.length}
            itemData={shownBookmarks}
            itemSize={22}
            width={398}
            ref={scrollRef}
            onScroll={() => scrollFunction()}
        >
            {Row}
        </List>
    );
};

export default memo(BookmarksFoundBox);
