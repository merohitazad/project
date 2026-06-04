import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 mt-4 shadow-xl text-center">
        <div className="text-7xl font-bold text-red-500">404</div>

        <h1 className="mt-4 text-2xl font-semibold text-slate-800">
          Page Not Found
        </h1>

        <p className="mt-3 text-slate-600">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;