import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";

const SignUp = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    username: "",
    password: [],
    confirmPassword: "",
  });

  const validateField = (name, value, form) => {
    if (name === "username") {
      return value.length < 3 ? "Username must be at least 3 characters long." : "";
    }

    if (name === "password") {
      const passwordErrors = [];
      if (value.length < 8) passwordErrors.push("At least 8 characters long");
      if (!/[a-z]/.test(value)) passwordErrors.push("Include a lowercase letter");
      if (!/[A-Z]/.test(value)) passwordErrors.push("Include an uppercase letter");
      if (!/\d/.test(value)) passwordErrors.push("Include a number");
      if (!/[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) passwordErrors.push("Include a special character");
      return passwordErrors;
    }

    if (name === "confirmPassword") {
      return value !== form.elements.password.value ? "Passwords do not match." : "";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, e.target.form);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: e.target.name === "password" ? [] : "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const hasErrors = errors.username || errors.confirmPassword || errors.password.length > 0;
    if (hasErrors) return;

    try {
      const response = await signupUser(data);
      const resData = await response.json();
      if (!response.ok) {
        setErrors((prev) => ({ ...prev, general: resData.message || "Signup failed" }));
        return;
      }
      event.target.reset();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white px-4 md:p-8 mt-4 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center pb-4 md:pb-8">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile: grid-cols-1 | Desktop: grid-cols-2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg ${errors.username ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Enter email"
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg ${errors.password.length > 0 ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password.map((err, index) => (
                <p key={index} className="text-red-500 text-xs mt-1">• {err}</p>
              ))}
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-2xl hover:bg-red-600 transition">
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 pt-3 md:pt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 font-medium no-underline hover:text-red-600 hover:underline transition duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;