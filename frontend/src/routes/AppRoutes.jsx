import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import HomePage from "../pages/HomePage";
import CreateFoodItem from "../pages/CreateFoodItem";
import FoodPartnerProfile from "../pages/FoodPartnerProfile";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<AuthForm />} />
        <Route path="/user/login" element={<AuthForm />} />
        <Route
          path="/food-partner/register"
          element={<AuthForm />}
        />
        <Route path="/food-partner/login" element={<AuthForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/create-food" element={<CreateFoodItem />} />
        <Route path="/food-partner/:id" element={<FoodPartnerProfile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
