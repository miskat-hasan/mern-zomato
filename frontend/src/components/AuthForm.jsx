// src/components/AuthForm.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

// form configuration
const authForms = {
  "user/register": {
    title: "User Registration",
    fields: [
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password" },
    ],
    buttonText: "Register",
  },
  "user/login": {
    title: "User Login",
    fields: [
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password" },
    ],
    buttonText: "Login",
  },
  "food-partner/register": {
    title: "Food Partner Registration",
    fields: [
      { name: "name", label: "Business Name", type: "text" },
      { name: "contactName", label: "Contact Name", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password" },
    ],
    buttonText: "Register",
  },
  "food-partner/login": {
    title: "Food Partner Login",
    fields: [
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password" },
    ],
    buttonText: "Login",
  },
};

export default function AuthForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace("/", "");
  const formConfig = authForms[path];

  // state
  const [formData, setFormData] = useState(
    formConfig.fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/${path}`,
        formData,
        { withCredentials: true }
      );
      setSuccess(response.data.message || "Success!");

      // clear inputs
      setFormData(
        formConfig.fields.reduce((acc, field) => {
          acc[field.name] = "";
          return acc;
        }, {})
      );

      // redirect for user
      if (path.includes("user")) {
        navigate("/"); // adjust route as needed
      }

      // redirect for food partner
      if (path.includes("food-partner")) {
        navigate("/create-food"); // adjust route as needed
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          {formConfig.title}
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {formConfig.fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && (
            <p className="text-sm text-green-500 text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {loading ? "Please wait..." : formConfig.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
