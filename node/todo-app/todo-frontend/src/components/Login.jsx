import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom"; 
import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";

const Login = () => {
  const { setIsLoggedIn, setUsername } = useContext(TodoItemsContext);
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser({
        email: event.target.email.value,
        password: event.target.password.value,
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok && data.success) {
        console.log("Login successful! Redirecting...");
        
        setIsLoggedIn(true);
        setUsername(data.user.username);
        navigate("/"); 
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert("Something went wrong. Is your backend server running?");
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center"> 
      <div className="w-full max-w-md bg-white p-8 m-4 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required 
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-500 font-medium hover:text-red-600 no-underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;