import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
      style={{ width: "280px" }}
    >
      <div className="nav nav-pills flex-column mb-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link link-body-emphasis side-bar-link ${isActive ? "active" : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/create-post"
          className={({ isActive }) =>
            `nav-link link-body-emphasis side-bar-link create-post-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Create Post
        </NavLink>
      </div>
      <hr />
    </div>
  );
};

export default SideBar;