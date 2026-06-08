import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="d-flex align-items-center justify-content-center bg-light px-3" style={{ minHeight: "70vh" }}>
      <div className="w-100 text-center p-5 mt-4 rounded-4 bg-white shadow" style={{ maxWidth: "450px" }}>
        <div className="display-1 fw-bold text-danger">404</div>
        <h1 className="mt-3 h3 fw-semibold text-dark">
          Page Not Found
        </h1>
        <p className="mt-3 text-muted">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-4 btn btn-primary btn-lg px-4 fs-6 fw-medium"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;