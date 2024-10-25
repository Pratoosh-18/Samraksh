import { useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/utils/api";

function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const formData = new FormData(e.target);
        const formDataObj = {};

        formData.forEach((value, key) => (formDataObj[key] = value));

        await api.post("/auth/register", formDataObj);
        alert("Registration successful!");
        navigate("/login");
      } catch (error) {
        alert("Registration failed: " + error.response.data.detail);
      }
    },
    [navigate],
  );

  return (
    <div>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit} className="flex w-[400px] flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" placeholder="Email" />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          type="submit"
          className="bg-brand-500 p-2 text-white hover:bg-brand-600"
        >
          Register
        </button>
      </form>

      <span>
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 underline-offset-2 hover:underline"
        >
          Login
        </Link>
      </span>
    </div>
  );
}

export default RegisterPage;
