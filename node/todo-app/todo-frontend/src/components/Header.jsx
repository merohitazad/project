import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";

const Header = () => {
  const { isLoggedIn, username, setIsLoggedIn } = useContext(TodoItemsContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPath = location.pathname === "/admin";

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Logout successful!");
        
        if (setIsLoggedIn) setIsLoggedIn(false); 
        
        navigate("/login");
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout network error:", error);
    }
  };

  return (
    <header className="bg-red-500 shadow-md flex justify-between items-center w-full px-4 md:px-8 py-3">
      <Link to="/" className="text-white no-underline text-xl md:text-2xl font-bold md:px-8">
        Todo App
      </Link>

      <nav>
        <div className="flex items-center gap-2 md:gap-4">
          {/* SCREEN CONDITION 1: Render specific layout if currently viewing the Admin gate */}
          {isAdminPath ? (
            <div className="text-white bg-blue-600 px-4 py-2 rounded-lg font-medium text-sm md:text-base border border-blue-400">
              System Admin Panel
            </div>
          ) : !isLoggedIn ? (
            <>
              <Link
                to="/login"
                className={`text-white no-underline px-3 md:px-6 py-2 rounded-lg text-sm md:text-base ${
                  location.pathname === "/login" ? "bg-red-400" : "hover:bg-red-300"
                } transition`}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={`text-white no-underline px-3 md:px-6 py-2 rounded-lg text-sm md:text-base ${
                  location.pathname === "/signup" ? "bg-red-400" : "hover:bg-red-300"
                } transition`}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-white no-underline px-3 md:px-6 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 transition text-sm md:text-base truncate max-w-25 md:max-w-none"
              >
                {`Hi ${username || "User Name"} !!`}
              </Link>

              <button
                onClick={handleLogout}
                className="text-white bg-transparent border border-white hover:bg-white hover:text-red-500 font-medium px-3 md:px-6 py-2 rounded-lg transition cursor-pointer text-sm md:text-base"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;