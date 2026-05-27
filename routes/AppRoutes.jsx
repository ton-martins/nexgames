import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

import AccountLayout from "../src/pages/AccountLayout/Index";
import AccountAdminCategories from "../src/pages/AccountLayout/Sections/AdminCategories";
import AccountAdminCompanies from "../src/pages/AccountLayout/Sections/AdminCompanies";
import AccountAdminGames from "../src/pages/AccountLayout/Sections/AdminGames";
import AccountAdminReports from "../src/pages/AccountLayout/Sections/AdminReports";
import AccountCart from "../src/pages/AccountLayout/Sections/Cart";
import AccountMyAccount from "../src/pages/AccountLayout/Sections/MyAccount";
import AccountMyWishlist from "../src/pages/AccountLayout/Sections/MyWishlist";
import AccountOrder from "../src/pages/AccountLayout/Sections/Order";
import Auth from "../src/pages/Auth";
import Checkout from "../src/pages/Checkout";
import Home from "../src/pages/Home";
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
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/account" element={<AccountLayout />}>
					<Route index element={<Navigate to="profile" replace />} />
					<Route path="profile" element={<AccountMyAccount />} />
					<Route path="wishlist" element={<AccountMyWishlist />} />
					<Route path="cart" element={<AccountCart />} />
					<Route path="orders" element={<AccountOrder />} />

					<Route element={<AdminRoute />}>
						<Route path="admin/games" element={<AccountAdminGames />} />
						<Route
							path="admin/categories"
							element={<AccountAdminCategories />}
						/>
						<Route
							path="admin/companies"
							element={<AccountAdminCompanies />}
						/>
						<Route path="admin/reports" element={<AccountAdminReports />} />
					</Route>
				</Route>

				<Route
					path="/my-account"
					element={<Navigate to="/account/profile" replace />}
				/>
				<Route
					path="/my-wishlist"
					element={<Navigate to="/account/wishlist" replace />}
				/>
				<Route path="/cart" element={<Navigate to="/account/cart" replace />} />
				<Route
					path="/orders"
					element={<Navigate to="/account/orders" replace />}
				/>
				<Route
					path="/admin/games"
					element={<Navigate to="/account/admin/games" replace />}
				/>
				<Route
					path="/admin/categories"
					element={<Navigate to="/account/admin/categories" replace />}
				/>
				<Route
					path="/admin/companies"
					element={<Navigate to="/account/admin/companies" replace />}
				/>
				<Route
					path="/admin/reports"
					element={<Navigate to="/account/admin/reports" replace />}
				/>
			</Route>
		</Routes>
	);
}
