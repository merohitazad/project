const Header = () => {
  return (
    <header className="text-bg-white header">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a href="#" className="px-3 nav-links">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="px-3 nav-links">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="px-3 nav-links">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="px-3 nav-links">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="px-3 nav-links">
                About
              </a>
            </li>
          </ul>
          <form
            className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
            role="search"
          >
            <input
              type="search"
              className="form-control form-control-dark text-bg-white border border-dark"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
          <div className="text-end">
            <button type="button" className="btn btn-success me-3 login-button">
              Login
            </button>
            <button type="button" className="btn btn-primary signup-button">
              Sign-up
            </button>
          </div>
        </div>
      </div>
      <hr className="line"/>
    </header>
  );
};

export default Header;
