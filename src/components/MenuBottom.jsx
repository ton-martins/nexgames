import { useEffect, useState } from "react";
import { Heart, House, ShoppingBag, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionUser } from "../../services/authService";
import { getCart } from "../../services/cartService";
import { getWishlist } from "../../services/wishlistService";

function joinClasses(...classNames) {
	return classNames.filter(Boolean).join(" ");
}

function isHomeRoute(pathname) {
	return pathname === "/";
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
	return pathname === "/my-account" || pathname.startsWith("/account");
}

export default function MenuBottom() {
	const navigate = useNavigate();
	const location = useLocation();
	const [sessionUser, setSessionUser] = useState(() => getSessionUser());
	const [wishlistCount, setWishlistCount] = useState(0);
	const [cartCount, setCartCount] = useState(0);

	useEffect(() => {
		setSessionUser(getSessionUser());
	}, [location.pathname]);

	useEffect(() => {
		let isMounted = true;

		async function loadCounts() {
			if (!getSessionUser()) {
				if (!isMounted) return;
				setWishlistCount(0);
				setCartCount(0);
				return;
			}

			try {
				const [wishlist, cart] = await Promise.all([
					getWishlist().catch(() => []),
					getCart().catch(() => null),
				]);

				if (!isMounted) return;

				setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
				setCartCount(Array.isArray(cart?.itens) ? cart.itens.length : 0);
			} catch {
				if (!isMounted) return;
				setWishlistCount(0);
				setCartCount(0);
			}
		}

		loadCounts();

		return () => {
			isMounted = false;
		};
	}, [location.pathname, sessionUser]);

	useEffect(() => {
		async function handleCartUpdated() {
			if (!getSessionUser()) {
				setCartCount(0);
				return;
			}

			try {
				const cart = await getCart().catch(() => null);
				setCartCount(Array.isArray(cart?.itens) ? cart.itens.length : 0);
			} catch {
				setCartCount(0);
			}
		}

		window.addEventListener("nexgames:cart-updated", handleCartUpdated);

		return () => {
			window.removeEventListener("nexgames:cart-updated", handleCartUpdated);
		};
	}, []);

	useEffect(() => {
		async function handleWishlistUpdated() {
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

	const items = [
		{
			key: "home",
			label: "Home",
			icon: House,
			active: isHomeRoute(location.pathname),
			onClick: () => navigate("/"),
			badge: 0,
		},
		{
			key: "wishlist",
			label: "Favoritos",
			icon: Heart,
			active: isWishlistRoute(location.pathname),
			onClick: () => navigateProtected("/my-wishlist"),
			badge: wishlistCount,
		},
		{
			key: "cart",
			label: "Carrinho",
			icon: ShoppingBag,
			active: isCartRoute(location.pathname),
			onClick: () => navigateProtected("/cart"),
			badge: cartCount,
		},
		{
			key: "account",
			label: "Conta",
			icon: User,
			active: isAccountRoute(location.pathname),
			onClick: () => navigateProtected("/my-account"),
			badge: 0,
		},
	];

	return (
		<>
			<div aria-hidden="true" className="h-[76px] md:hidden" />

			<nav
				aria-label="Menu inferior da loja"
				className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border-color)] bg-[color:var(--surface-color)] shadow-[0_-10px_30px_rgba(15,23,42,0.08)] md:hidden"
			>
				<div className="grid grid-cols-4">
					{items.map((item) => {
						const Icon = item.icon;

						return (
							<button
								key={item.key}
								type="button"
								onClick={item.onClick}
								className={joinClasses(
									"relative flex min-h-[76px] flex-col items-center justify-center gap-1 px-2 pb-2 pt-3 text-[11px] font-semibold transition",
									item.active
										? "text-[color:var(--text-primary-color)]"
										: "text-[color:var(--text-muted-color)]"
								)}
							>
								<div
									className={joinClasses(
										"relative inline-flex h-10 w-10 items-center justify-center rounded-full transition",
										item.active
											? "bg-[color:var(--primary-soft-color)] text-[color:var(--primary-color)]"
											: "text-[color:var(--text-primary-color)]"
									)}
								>
									<Icon size={19} />

									{item.badge > 0 ? (
										<span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--primary-color)] px-1 text-[10px] font-bold text-[color:var(--text-on-primary-color)]">
											{item.badge}
										</span>
									) : null}
								</div>

								<span>{item.label}</span>
							</button>
						);
					})}
				</div>
			</nav>
		</>
	);
}
