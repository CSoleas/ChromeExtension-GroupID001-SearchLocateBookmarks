/*global chrome*/
const API_GetAllBookmarks = async () => {
    const logTree = (tree) => {
        return tree[0].children;
    };

    const onRejected = (error) => {
        console.log(`An error: ${error}`);
    };

    const treeSructure = chrome.bookmarks.getTree();
    return treeSructure.then(logTree, onRejected);
};

export default API_GetAllBookmarks;
