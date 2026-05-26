import { Route, Routes } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

import AdminCompanies from "../src/pages/AdminCompanies";
import AdminGames from "../src/pages/AdminGames";
import AdminReports from "../src/pages/AdminReports";
import Auth from "../src/pages/Auth";
import Cart from "../src/pages/Cart";
import Checkout from "../src/pages/Checkout";
import Home from "../src/pages/Home";
import MyAccount from "../src/pages/MyAccount";
import MyWishlist from "../src/pages/MyWishlist";
import Order from "../src/pages/Order";
import SingleProduct from "../src/pages/SingleProduct";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/auth" element={<Auth />} />
			<Route path="/login" element={<Auth />} />
			<Route path="/register" element={<Auth />} />

			<Route element={<ProtectedRoute />}>
				<Route path="/product/:id" element={<SingleProduct />} />
				<Route path="/my-wishlist" element={<MyWishlist />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/orders" element={<Order />} />
				<Route path="/my-account" element={<MyAccount />} />
			</Route>

			<Route element={<AdminRoute />}>
				<Route path="/admin/companies" element={<AdminCompanies />} />
				<Route path="/admin/games" element={<AdminGames />} />
				<Route path="/admin/reports" element={<AdminReports />} />
			</Route>
		</Routes>
	);
}
