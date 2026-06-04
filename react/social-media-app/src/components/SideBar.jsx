const SideBar = ({selectedTab , setSelectedTab}) => {

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
      style={{ width: "280px" }}
    >
      <div className="nav nav-pills flex-column mb-auto">
        <div
          
          className={`nav-link link-body-emphasis side-bar-link ${selectedTab === "Home" && "active"}`}
          aria-current="page"
          onClick={() => setSelectedTab("Home")}
        >
          Home
        </div>
        <div
          className={`nav-link link-body-emphasis side-bar-link create-post-link ${selectedTab === "CreatePost" && "active" } `}
          onClick={() => setSelectedTab("CreatePost")}
        >
          Create Post
        </div>
      </div>
      <hr />
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>Rohit Kumar</strong>
        </a>
      </div>
    </div>
  );
};

export default SideBar;
