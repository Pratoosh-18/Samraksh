import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "@/context/app-provider";
import api from "@/utils/api";
import loginBG from "./loginBG.jpeg";
import { SamrakshIcon } from "./icons";
import { emailRegex } from "@/constants/validations";

function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAppContext();

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (formDataObj) => {
    const newErrors = {};

    if (!formDataObj.username || !emailRegex.test(formDataObj.username)) {
      newErrors.username = "Please enter a valid email address.";
    }

    if (!formDataObj.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formDataObj = {};

    formData.forEach((value, key) => (formDataObj[key] = value));

    if (!validateForm(formDataObj)) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        new URLSearchParams(formDataObj)
      );
      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      setApiError(error.response?.data?.detail || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBG})` }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 text-white bg-gray-700 hover:bg-gray-900 px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <div className="bg-[#e7e7e7]/100 shadow-lg rounded-lg p-8 w-96 flex flex-col gap-5 relative">
        <div className="w-full flex justify-center">
          <SamrakshIcon className="h-24 text-brand-600" />
        </div>

        <h2 className="text-center font-semibold text-xl text-gray-700">Login</h2>

        {apiError && (
          <div className="text-red-600 text-center p-2 bg-red-100 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold text-gray-700">
              Admin Email
            </label>
            <input
              id="email"
              type="text"
              name="username"
              placeholder="Email"
              className={`w-full p-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-[#562e2c]`}
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">{errors.username}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-[#562e2c]`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-700 hover:bg-brand-900 text-white py-2 rounded transition duration-300 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <span className="text-center text-gray-600">
          Didn't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 underline-offset-2 hover:underline"
          >
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
