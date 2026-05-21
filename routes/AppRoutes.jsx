import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import SingleProduct from "../src/pages/SingleProduct";
import MyWishlist from "../src/pages/MyWishlist";
import Cart from "../src/pages/Cart";
import Checkout from "../src/pages/Checkout";
import Order from "../src/pages/Order";
import MyAccount from "../src/pages/MyAccount";
import AdminCompanies from "../src/pages/AdminCompanies";
import AdminGames from "../src/pages/AdminGames";
import AdminReports from "../src/pages/AdminReports";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas por autenticação */}
            <Route element={<ProtectedRoute />}>
                <Route path="/product/:id" element={<SingleProduct />} />
                <Route path="/my-wishlist" element={<MyWishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/my-account" element={<MyAccount />} />
            </Route>

            {/* Rotas protegidas por perfil de administrador */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/companies" element={<AdminCompanies />} />
                <Route path="/admin/games" element={<AdminGames />} />
                <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
        </Routes>
    );
}