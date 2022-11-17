import React, { useState, useEffect, useRef, useCallback } from "react";

import API_GetAllBookmarks from "./API_GetAllBookmarks";
import LocateModal from "./LocateModal";
import DetailsModal from "./DetailsModal";
import RightClickMenu from "./RightClickMenu";
import SearchInput from "./SearchInput";
import SortMenu from "./SortMenu";
import BookmarksFoundBox from "./BookmarksFoundBox";
import var_SelectedBookmarks from "./Var_selected";

/* global chrome */
document.addEventListener(
    "contextmenu",
    (event) => {
        event.preventDefault();
    },
    false,
);

const SearchBookmarksWindow = () => {
    const [shownBookmarks, setShownBookmarks] = useState();
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [rightClickMenuVisible, setRightClickMenuVisible] = useState(false);
    const [locateModalVisible, setLocateModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const sortMethod = useRef(3); // current sorting method
    const prevSortMethod = useRef(3); // keep track of previous sorting methods
    const highlightedSortButtonIndex = useRef(-1); // sorting choice Index
    const allBookmarks = useRef([]);
    const hashmapIDtoData = useRef({});
    const filterString = useRef(""); // filter string
    const locateStack = useRef([]);
    const currentIndex = useRef(-1);
    const scrollRef = useRef(null);

    useEffect(async () => {
        populateArrays(await API_GetAllBookmarks()); // populates allBookmarks and hashmapIDtoData
        allBookmarks.current.sort((a, b) => {
            return b.dateAdded - a.dateAdded;
        });
        setShownBookmarks(allBookmarks.current);
    }, []);

    // POPULATE: BOOKMARK ARRAY  ############################################
    const populateArrays = (data) => {
        for (let item of data) {
            hashmapIDtoData.current[item.id] = [item.title, item.parentId, item.url ? item.url : null, item.dateAdded];
            if (item.url) {
                allBookmarks.current.push({
                    dateAdded: item.dateAdded,
                    id: item.id,
                    lowercaseTitle: item.title.toLowerCase(),
                    title: item.title,
                    url: item.url,
                });
            } else {
                populateArrays(item.children);
            }
        }
    };

    // SEARCH ##############################################
    const searchBookmarkList = useCallback((renewedFilter) => {
        filterString.current = renewedFilter.toLowerCase();
        let viewResults = allBookmarks.current.filter((item) => {
            if (filterString.current === "") {
                return item;
            } else if (item.lowercaseTitle.includes(filterString.current)) {
                return item;
            }
        });
        setShownBookmarks(viewResults);
        currentIndex.current = -1;
    }, []);

    // OPEN MODALS ###############################################################
    const openLocateModal = (event) => {
        event.preventDefault();
        event.target.focus();
        locateStack.current = [];

        if (currentIndex.current > -1) {
            setLocateModalVisible(true);
            let bookmarkID = shownBookmarks[currentIndex.current].id;

            while (bookmarkID in hashmapIDtoData.current) {
                locateStack.current.push(hashmapIDtoData.current[bookmarkID]);
                bookmarkID = hashmapIDtoData.current[bookmarkID][1];
            }
            document.getElementById("LocateCloseButton").focus();
        }
    };

    const openDetailsModal = (event) => {
        event.target.focus();
        if (currentIndex.current > -1) {
            setDetailsModalVisible(true);
        }
    };

    // OPEN SELECTED WEBSITES  ##############################################
    const createTabsFromSelectedBookmarks = useCallback(() => {
        var_SelectedBookmarks.forEach(async (nameofClass, id) => {
            if (nameofClass === "selected" || nameofClass === "selectedAndFocused") {
                await chrome.tabs.create({
                    url: hashmapIDtoData.current[id][2],
                    active: false,
                });
            }
        });

        if (rightClickMenuVisible) {
            document.getElementById("SortedBox").className = "SortedBox";
            document.getElementById("SortedBox").focus();
            setRightClickMenuVisible(false);
        }
    }, [rightClickMenuVisible]);

    // DOUBLE CLICK TO OPEN WEBSITE ##########################################
    const doubleClickFunct = async (e) => {
        await chrome.tabs.create({
            url: hashmapIDtoData.current[e.target.parentElement.id][2],
            active: false,
        });
        document.getElementById(e.target.parentElement.id).className = "selectedAndFocused";
    };

    // RIGHTCLICK MENU: OPEN, CLOSE & DESELECT
    const rightClickMenu = useCallback(
        (event) => {
            let menu = document.getElementById("rightClickMenu");
            menu.style.left = event.pageX + "px";
            menu.style.top = event.pageY + "px";
            setRightClickMenuVisible(true);
        },
        [rightClickMenuVisible],
    );

    const closeRightClickMenu = useCallback(
        (event) => {
            event.preventDefault();
            setRightClickMenuVisible(false);
            document.getElementById("SortedBox").className = "SortedBox";
            document.getElementById("SortedBox").focus();
        },
        [rightClickMenuVisible],
    );

    const rightClickMenuDeselect = useCallback(
        (event) => {
            event.preventDefault();
            var_SelectedBookmarks.forEach((_, id) => {
                if (document.getElementById(id) !== null) document.getElementById(id).className = "unselected";
            });
            var_SelectedBookmarks.clear();

            currentIndex.current = -1;
            setRightClickMenuVisible(false);
            document.getElementById("SortedBox").className = "SortedBox";
            document.getElementById("SortedBox").focus();
        },
        [rightClickMenuVisible],
    );

    // SORT ITEMS
    const sortBookmarksByMethod = useCallback(
        (sortingMethod) => {
            if (prevSortMethod.current === sortingMethod) {
                return;
            }

            if (sortingMethod === 4) {
                // Old to New
                sortMethod.current = 4;
                allBookmarks.current.sort((a, b) => {
                    return a.dateAdded - b.dateAdded;
                });
            } else if (sortingMethod === 3) {
                // New to Old
                sortMethod.current = 3;
                allBookmarks.current.sort((a, b) => {
                    return b.dateAdded - a.dateAdded;
                });
            } else if (sortingMethod === 1) {
                // A to Z
                sortMethod.current = 1;
                allBookmarks.current.sort((a, b) =>
                    a.lowercaseTitle > b.lowercaseTitle ? 1 : a.lowercaseTitle < b.lowercaseTitle ? -1 : 0,
                );
            } else {
                // Z to A
                sortMethod.current = 2;
                allBookmarks.current.sort((a, b) =>
                    b.lowercaseTitle > a.lowercaseTitle ? 1 : b.lowercaseTitle < a.lowercaseTitle ? -1 : 0,
                );
            }

            let viewResults = allBookmarks.current.filter((item) => {
                if (filterString.current === "") {
                    return item;
                } else if (item.lowercaseTitle.includes(filterString.current)) {
                    return item;
                }
            });
            prevSortMethod.current = sortingMethod;
            setSortMenuVisible(false);

            searchBookmarkList(filterString.current);
            setShownBookmarks(viewResults);

            document.getElementById("SortedBox").focus();
        },
        [sortMenuVisible],
    );

    // SORT MENU: OPEN & MOVEMENT ####################################################
    const openSortMenu = (event) => {
        let keyPressed = event.key;
        let shift = event.shiftKey;

        if (keyPressed === "Enter") {
            setSortMenuVisible((v) => !v);
        } else if (
            (keyPressed === "ArrowDown" && sortMenuVisible) ||
            (keyPressed === "Tab" && !shift && sortMenuVisible)
        ) {
            event.preventDefault();
            highlightedSortButtonIndex.current = 0;
            document.getElementById("SortbtnContainerButton0").focus();
        } else if (keyPressed === "Tab" && shift === true && sortMenuVisible === false) {
            event.preventDefault();
            document.getElementById("SortedBox").focus();
            let ele1 = document.getElementsByClassName("selectedAndFocused");
            let ele2 = document.getElementsByClassName("unselectedButFocused");
            if (ele1.length > 0) ele1[0].focus();
            if (ele2.length > 0) ele2[0].focus();
            return;
        } else if (keyPressed === "Tab" && shift === true && sortMenuVisible === true) {
            event.preventDefault();
            highlightedSortButtonIndex.current = 3;
            document.getElementById("SortbtnContainerButton3").focus();
        }
    };

    const sortMenuMovement = useCallback((event) => {
        let keyPressed = event.key;
        let shift = event.shiftKey;
        event.preventDefault();

        if (keyPressed === "ArrowDown" || (keyPressed === "Tab" && !shift)) {
            let i = (highlightedSortButtonIndex.current + 1) % 4;
            document.getElementById(`SortbtnContainerButton${i}`).focus();
            highlightedSortButtonIndex.current = i;
        } else if (keyPressed === "ArrowUp" || (keyPressed === "Tab" && shift)) {
            if (highlightedSortButtonIndex.current === 0) {
                document.getElementById(`SortbtnContainerButton3`).focus();
                highlightedSortButtonIndex.current = 3;
                return;
            }
            let i = highlightedSortButtonIndex.current - 1;
            document.getElementById(`SortbtnContainerButton${i}`).focus();
            highlightedSortButtonIndex.current = i;
        }
    }, []);

    // ESCAPE KEY - CLOSE OPTIONS ##########################################
    const escapeKey = (event) => {
        let keypressed = event.key;
        if (keypressed === "Escape" || keypressed === "Esc") {
            event.preventDefault();
            if (sortMenuVisible) {
                setSortMenuVisible(false);
                let ele = document.activeElement.id;
                if (
                    ele === "SortbtnContainerButton0" ||
                    ele === "SortbtnContainerButton1" ||
                    ele === "SortbtnContainerButton2" ||
                    ele === "SortbtnContainerButton3"
                ) {
                    document.getElementById("sortMenuButton").focus();
                }
            } else if (rightClickMenuVisible) {
                setRightClickMenuVisible(false);
                document.getElementById("SortedBox").className = "SortedBox";
                document.getElementById("SortedBox").focus();
            } else if (locateModalVisible) {
                setLocateModalVisible(false);
            } else if (detailsModalVisible) {
                setDetailsModalVisible(false);
            } else {
                window.close();
            }
        } else if (keypressed === "Tab" && (locateModalVisible || detailsModalVisible)) {
            document.getElementById("LocateCloseButton").focus();
        }
    };

    // BACK DROP FUNCTIONS
    const closeLocateModal = useCallback(
        (event) => {
            event.preventDefault();
            setLocateModalVisible(false);
            setDetailsModalVisible(false);
            locateStack.current = [];
            document.getElementById("SortedBox").focus();
            let ele1 = document.getElementsByClassName("selectedAndFocused");
            let ele2 = document.getElementsByClassName("unselectedButFocused");
            if (ele1.length > 0) ele1[0].focus();
            if (ele2.length > 0) ele2[0].focus();
        },
        [locateModalVisible, detailsModalVisible],
    );

    // MOVE UP AND DOWN  WITH KEYBOARD ##########################
    const upOrDownKeyPressed = (event) => {
        if (event.key === "Enter") {
            createTabsFromSelectedBookmarks();
            return;
        }
        if (
            document.activeElement.className === "SortedBox" &&
            (event.key === "ArrowUp" || event.key === "ArrowDown") &&
            shownBookmarks.length > 0
        ) {
            event.preventDefault();

            if (currentIndex.current === -1) {
                let id = shownBookmarks[0].id;
                let ele = document.getElementById(id);
                currentIndex.current = 0;
                var_SelectedBookmarks.set(id, "selectedAndFocused");
                if (!!ele) {
                    ele.className = "selectedAndFocused";
                    ele.focus();
                }
            } else {
                let ele = document.getElementById(shownBookmarks[currentIndex.current].id);
                if (!!ele) {
                    ele.focus();
                }
            }
            scrollRef.current.scrollToItem(currentIndex.current, "center");
        }
    };

    return (
        <div className="SortedBackgroundPage" onKeyDown={(e) => escapeKey(e)}>
            <p className="SortedHeader"> Search bookmarks </p>

            <SearchInput searchBookmarkList={searchBookmarkList} />
            <a
                class="backdrop"
                onMouseDown={(e) => closeLocateModal(e)}
                style={locateModalVisible || detailsModalVisible ? { display: "block" } : { display: "none" }}
            ></a>

            <RightClickMenu
                rightClickMenuVisible={rightClickMenuVisible}
                createTabsFromSelectedBookmarks={createTabsFromSelectedBookmarks}
                rightClickMenuDeselect={rightClickMenuDeselect}
                closeRightClickMenu={closeRightClickMenu}
            />
            <LocateModal
                data={locateStack.current}
                locateModalVisible={locateModalVisible}
                closeLocateModal={closeLocateModal}
            />
            {currentIndex.current > -1 && (
                <DetailsModal
                    data={hashmapIDtoData.current[shownBookmarks[currentIndex.current].id]}
                    detailsModalVisible={detailsModalVisible}
                    closeLocateModal={closeLocateModal}
                />
            )}

            <div className="SortedContainer">
                <div
                    className="SortedBox"
                    id="SortedBox"
                    tabindex="0"
                    onKeyDown={(e) => upOrDownKeyPressed(e)}
                    onDoubleClick={(e) => doubleClickFunct(e)}
                >
                    {!shownBookmarks ? (
                        <div className="loadingwindow">
                            <p>loading...</p>
                        </div>
                    ) : (
                        <BookmarksFoundBox
                            shownBookmarks={shownBookmarks}
                            currentIndex={currentIndex}
                            scrollRef={scrollRef}
                            rightClickMenu={rightClickMenu}
                        />
                    )}
                </div>

                <div className="SortedButtonsBox">
                    <button
                        className="sortMenuButton"
                        id="sortMenuButton"
                        onMouseDown={() => setSortMenuVisible((v) => !v)}
                        onKeyDown={(e) => openSortMenu(e)}
                        style={sortMenuVisible ? { border: "2px solid #1A73E8" } : null}
                    >
                        Sort
                    </button>

                    <SortMenu
                        sortMethod={sortMethod}
                        sortMenuVisible={sortMenuVisible}
                        sortBookmarksByMethod={sortBookmarksByMethod}
                        sortMenuMovement={sortMenuMovement}
                    />
                    <button className="detailsButton" onClick={(e) => openDetailsModal(e)}>
                        Details
                    </button>

                    <button
                        className="locateButton"
                        onClick={(e) => {
                            openLocateModal(e);
                        }}
                    >
                        Locate
                    </button>
                    <button className="openButton" onClick={() => createTabsFromSelectedBookmarks()}>
                        Open
                    </button>
                    <button className="cancelButton" onClick={() => window.close()}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBookmarksWindow;
