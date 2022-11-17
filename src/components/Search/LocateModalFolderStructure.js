import iconFolder from "../icons/IconFolder.png";

const LocateModalFolderStructure = ({ data = [] }) => {
    let url = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${data[0][2]}&size=16`;
    let num = 14;
    return (
        <>
            {data.map((_, index) => (
                <div style={{ display: "flex", marginLeft: `${num * index}px` }}>
                    <img
                        className={data.length - 1 - index !== 0 ? "imgFolder" : "faviLocate"}
                        src={data.length - 1 - index !== 0 ? iconFolder : url}
                    ></img>
                    <div className="nbLocate">{data[data.length - 1 - index][0]}</div>
                </div>
            ))}
        </>
    );
};

export default LocateModalFolderStructure;
