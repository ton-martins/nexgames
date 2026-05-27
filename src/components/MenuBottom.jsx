import { useEffect, useState } from "react";
import {
	Heart,
	House,
	Package,
	ShoppingCart,
	User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionUser } from "../../services/authService";
import { getCart, removeFromCart } from "../../services/cartService";
import { getWishlist } from "../../services/wishlistService";
import ModalCart from "./shared/ModalCart";

function joinClasses(...classNames) {
	return classNames.filter(Boolean).join(" ");
}

function isHomeRoute(pathname) {
	return pathname === "/";
}

function isOrdersRoute(pathname) {
	return pathname === "/orders" || pathname.startsWith("/account/orders");
}

function isWishlistRoute(pathname) {
	return pathname === "/my-wishlist" || pathname.startsWith("/account/wishlist");
}

function isCartRoute(pathname) {
	return (
		pathname === "/cart" ||
		pathname === "/checkout" ||
		pathname.startsWith("/account/cart")
	);
}

function isAccountRoute(pathname) {
	return pathname === "/my-account" || pathname.startsWith("/account/profile");
}

export default function MenuBottom() {
	const navigate = useNavigate();
	const location = useLocation();
	const [sessionUser, setSessionUser] = useState(() => getSessionUser());
	const [wishlistCount, setWishlistCount] = useState(0);
	const [cart, setCart] = useState(null);
	const [cartCount, setCartCount] = useState(0);
	const [isCartModalOpen, setIsCartModalOpen] = useState(false);
	const [isCartLoading, setIsCartLoading] = useState(false);
	const [isCartUpdating, setIsCartUpdating] = useState(false);

	useEffect(() => {
		setSessionUser(getSessionUser());
	}, [location.pathname]);

	async function refreshCartState() {
		if (!getSessionUser()) {
			setCart(null);
			setCartCount(0);
			return;
		}

		setIsCartLoading(true);

		try {
			const cartData = await getCart().catch(() => null);
			const items = Array.isArray(cartData?.itens) ? cartData.itens : [];

			setCart(cartData);
			setCartCount(items.length);
		} catch {
			setCart(null);
			setCartCount(0);
		} finally {
			setIsCartLoading(false);
		}
	}

	async function refreshWishlistState() {
		if (!getSessionUser()) {
			setWishlistCount(0);
			return;
		}

		try {
			const wishlist = await getWishlist().catch(() => []);
			setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
		} catch {
			setWishlistCount(0);
		}
	}

	useEffect(() => {
		let isMounted = true;

		async function loadMenuState() {
			if (!getSessionUser()) {
				if (!isMounted) return;
				setCart(null);
				setWishlistCount(0);
				setCartCount(0);
				return;
			}

			if (!isMounted) return;
			setIsCartLoading(true);

			try {
				const [wishlist, cartData] = await Promise.all([
					getWishlist().catch(() => []),
					getCart().catch(() => null),
				]);

				if (!isMounted) return;

				const items = Array.isArray(cartData?.itens) ? cartData.itens : [];

				setCart(cartData);
				setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
				setCartCount(items.length);
			} catch {
				if (!isMounted) return;
				setCart(null);
				setWishlistCount(0);
				setCartCount(0);
			} finally {
				if (!isMounted) return;
				setIsCartLoading(false);
			}
		}

		loadMenuState();

		return () => {
			isMounted = false;
		};
	}, [location.pathname, sessionUser]);

	useEffect(() => {
		async function handleCartUpdated() {
			await refreshCartState();
		}

		window.addEventListener("nexgames:cart-updated", handleCartUpdated);

		return () => {
			window.removeEventListener("nexgames:cart-updated", handleCartUpdated);
		};
	}, []);

	useEffect(() => {
		async function handleWishlistUpdated() {
			await refreshWishlistState();
		}

		window.addEventListener("nexgames:wishlist-updated", handleWishlistUpdated);

		return () => {
			window.removeEventListener(
				"nexgames:wishlist-updated",
				handleWishlistUpdated
			);
		};
	}, []);

	function navigateProtected(pathname) {
		if (getSessionUser()) {
			navigate(pathname);
			return;
		}

		navigate("/auth", {
			state: { redirectTo: pathname },
		});
	}

	function handleCartOpen() {
		setIsCartModalOpen(true);

		if (getSessionUser()) {
			refreshCartState();
		}
	}

	async function handleRemoveCartItem(item) {
		if (!item?.fkJogo) {
			return;
		}

		setIsCartUpdating(true);

		try {
			await removeFromCart(item.fkJogo);
			await refreshCartState();
			window.dispatchEvent(new Event("nexgames:cart-updated"));
		} finally {
			setIsCartUpdating(false);
		}
	}

	function handleViewCart() {
		setIsCartModalOpen(false);
		navigateProtected("/cart");
	}

	function handleCheckout() {
		setIsCartModalOpen(false);
		navigateProtected("/checkout");
	}

	function handleLoginFromCart() {
		setIsCartModalOpen(false);
		navigate("/auth", { state: { redirectTo: "/cart" } });
	}

	const homeActive = isHomeRoute(location.pathname);
	const ordersActive = isOrdersRoute(location.pathname);
	const wishlistActive = isWishlistRoute(location.pathname);
	const accountActive = isAccountRoute(location.pathname);
	const cartActive = isCartRoute(location.pathname) || isCartModalOpen;

	return (
		<>
			<div
				aria-hidden="true"
				className="h-[78px] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden"
			/>

			<nav
				aria-label="Menu inferior da loja"
				className="fixed bottom-0 z-50 flex w-full items-center justify-between border-t border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-6 py-2 md:hidden"
			>
				<button
					type="button"
					onClick={() => navigate("/")}
					className={joinClasses(
						"flex flex-col items-center p-2 transition",
						homeActive
							? "text-[color:var(--secondary-color)]"
							: "text-[color:var(--text-muted-color)]"
					)}
				>
					<House size={16} className="mb-1" />
					<span className="text-[10px] font-medium">Início</span>
				</button>

				<button
					type="button"
					onClick={() => navigateProtected("/orders")}
					className={joinClasses(
						"flex flex-col items-center p-2 transition",
						ordersActive
							? "text-[color:var(--secondary-color)]"
							: "text-[color:var(--text-muted-color)]"
					)}
				>
					<Package size={16} className="mb-1" />
					<span className="text-[10px] font-medium">Pedidos</span>
				</button>

				<div className="relative -top-5">
					<button
						type="button"
						onClick={() => navigateProtected("/my-wishlist")}
						className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
						style={{
							backgroundColor: "var(--primary-color)",
							color: "var(--primary-ui-text-color)",
						}}
					>
						<Heart
							size={20}
							fill={wishlistActive ? "currentColor" : "none"}
						/>
					</button>
					<span
						className={joinClasses(
							"absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium",
							wishlistActive
								? "text-[color:var(--secondary-color)]"
								: "text-[color:var(--text-muted-color)]"
						)}
					>
						Favoritos
					</span>
					{wishlistCount > 0 ? (
						<span className="absolute -right-1 top-0 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--secondary-color)] px-1 text-[10px] font-bold text-white shadow-sm">
							{wishlistCount}
						</span>
					) : null}
				</div>

				<button
					type="button"
					onClick={() => navigateProtected("/my-account")}
					className={joinClasses(
						"flex flex-col items-center p-2 transition",
						accountActive
							? "text-[color:var(--secondary-color)]"
							: "text-[color:var(--text-muted-color)]"
					)}
				>
					<User size={16} className="mb-1" />
					<span className="text-[10px] font-medium">Conta</span>
				</button>

				<button
					type="button"
					onClick={handleCartOpen}
					className={joinClasses(
						"relative flex flex-col items-center p-2 transition",
						cartActive
							? "text-[color:var(--secondary-color)]"
							: "text-[color:var(--text-muted-color)]"
					)}
				>
					<ShoppingCart size={16} className="mb-1" />
					<span className="text-[10px] font-medium">Carrinho</span>
					{cartCount > 0 ? (
						<span className="pointer-events-none absolute -right-1 top-0 rounded-full bg-[color:var(--secondary-color)] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
							{cartCount}
						</span>
					) : null}
				</button>
			</nav>

			<ModalCart
				open={isCartModalOpen}
				cart={cart}
				isAuthenticated={Boolean(sessionUser)}
				isLoading={isCartLoading}
				isUpdating={isCartUpdating}
				onClose={() => setIsCartModalOpen(false)}
				onLogin={handleLoginFromCart}
				onRemoveItem={handleRemoveCartItem}
				onViewCart={handleViewCart}
				onCheckout={handleCheckout}
			/>
		</>
	);
}
