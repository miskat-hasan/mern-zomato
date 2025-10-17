// src/config/authForms.ts
export const authForms = {
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
