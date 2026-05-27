import { useEffect, useMemo, useRef, useState } from "react";
import {
	ChevronDown,
	Heart,
	Search,
	ShoppingBag,
	User,
	X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSessionUser } from "../../services/authService";
import { getCart, removeFromCart } from "../../services/cartService";
import { getPublicGameCategories } from "../../services/gameService";
import { getWishlist } from "../../services/wishlistService";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import ModalCart from "./shared/ModalCart";

const ALL_CATEGORIES_LABEL = "Todas as categorias";

export default function Header({ games = [] }) {
	const navigate = useNavigate();
	const location = useLocation();
	const categoryMenuRef = useRef(null);

	const [sessionUser, setSessionUser] = useState(() => getSessionUser());
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_LABEL);
	const [wishlistCount, setWishlistCount] = useState(0);
	const [cart, setCart] = useState(null);
	const [cartCount, setCartCount] = useState(0);
	const [cartTotal, setCartTotal] = useState(0);
	const [isCartModalOpen, setIsCartModalOpen] = useState(false);
	const [isCartLoading, setIsCartLoading] = useState(false);
	const [isCartUpdating, setIsCartUpdating] = useState(false);

	const categories = useMemo(() => {
		return [ALL_CATEGORIES_LABEL, ...getPublicGameCategories(games)];
	}, [games]);

	useEffect(() => {
		setSessionUser(getSessionUser());
	}, [location.pathname]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const querySearch = params.get("search") || "";
		const queryCategory = params.get("categoria") || ALL_CATEGORIES_LABEL;
		const safeCategory = categories.includes(queryCategory)
			? queryCategory
			: ALL_CATEGORIES_LABEL;

		setSearchTerm(querySearch);
		setSelectedCategory(safeCategory);
		setIsCategoryMenuOpen(false);
	}, [categories, location.search]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (!categoryMenuRef.current?.contains(event.target)) {
				setIsCategoryMenuOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		let isMounted = true;

		async function loadHeaderActions() {
			if (!sessionUser) {
				if (!isMounted) return;
				setCart(null);
				setWishlistCount(0);
				setCartCount(0);
				setCartTotal(0);
				return;
			}

			try {
				if (!isMounted) return;
				setIsCartLoading(true);

				const [wishlist, cartData] = await Promise.all([
					getWishlist().catch(() => []),
					getCart().catch(() => null),
				]);

				if (!isMounted) return;

				const items = Array.isArray(cartData?.itens) ? cartData.itens : [];
				const total = items.reduce((sum, item) => {
					return sum + getDiscountedPrice(item?.jogo);
				}, 0);

				setCart(cartData);
				setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
				setCartCount(items.length);
				setCartTotal(total);
			} catch {
				if (!isMounted) return;
				setCart(null);
				setWishlistCount(0);
				setCartCount(0);
				setCartTotal(0);
			} finally {
				if (!isMounted) return;
				setIsCartLoading(false);
			}
		}

		loadHeaderActions();

		return () => {
			isMounted = false;
		};
	}, [location.pathname, sessionUser]);

	async function refreshCartState() {
		if (!getSessionUser()) {
			setCart(null);
			setCartCount(0);
			setCartTotal(0);
			return;
		}

		setIsCartLoading(true);

		try {
			const cartData = await getCart().catch(() => null);
			const items = Array.isArray(cartData?.itens) ? cartData.itens : [];
			const total = items.reduce((sum, item) => {
				return sum + getDiscountedPrice(item?.jogo);
			}, 0);

			setCart(cartData);
			setCartCount(items.length);
			setCartTotal(total);
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
		async function handleCartUpdated() {
			await refreshCartState();
		}

		window.addEventListener("nexgames:cart-updated", handleCartUpdated);

		return () => {
			window.removeEventListener("nexgames:cart-updated", handleCartUpdated);
		};
	}, [location.pathname]);

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
	}, [location.pathname]);

	function navigateWithCategory(category) {
		const params = new URLSearchParams();

		if (searchTerm.trim()) {
			params.set("search", searchTerm.trim());
		}

		if (category && category !== ALL_CATEGORIES_LABEL) {
			params.set("categoria", category);
		}

		navigate({
			pathname: "/",
			search: params.toString() ? `?${params.toString()}` : "",
		});
	}

	function handleSearchSubmit(event) {
		event.preventDefault();
		navigateWithCategory(selectedCategory);
		setIsMobileSearchOpen(false);
		setIsCategoryMenuOpen(false);
	}

	function handleCategorySelect(category) {
		setSelectedCategory(category);
		setIsCategoryMenuOpen(false);
		navigateWithCategory(category);
	}

	function handleCartOpen() {
		setIsCartModalOpen(true);
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
		navigate("/cart");
	}

	function handleCheckout() {
		setIsCartModalOpen(false);
		navigate("/checkout");
	}

	function handleLoginFromCart() {
		setIsCartModalOpen(false);
		navigate("/login", { state: { redirectTo: "/cart" } });
	}

	return (
		<header className="sticky top-0 z-30 border-b border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-primary-color)]">
			<div className="app-container">
				<div className="grid min-h-[88px] grid-cols-[1fr_auto] items-center gap-4 py-4 lg:grid-cols-[220px_minmax(560px,760px)_auto] lg:justify-between lg:gap-8 lg:py-0">
					<Link
						to="/"
						aria-label="Ir para a página inicial"
						className="inline-flex items-center"
					>
						<span className="inline-flex items-center text-3xl font-extrabold leading-none lg:text-[38px]">
							<span className="text-[color:var(--text-primary-color)]">
								NexGames
							</span>
							<span className="text-[color:var(--primary-color)]">.</span>
						</span>
					</Link>

					<button
						type="button"
						aria-label={isMobileSearchOpen ? "Fechar pesquisa" : "Abrir pesquisa"}
						onClick={() => setIsMobileSearchOpen((current) => !current)}
						className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-transparent text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-light-color)] hover:text-[color:var(--text-primary-color)] lg:hidden"
					>
						{isMobileSearchOpen ? <X size={18} /> : <Search size={18} />}
					</button>

					<form
						onSubmit={handleSearchSubmit}
						className={`${
							isMobileSearchOpen ? "grid" : "hidden"
						} col-span-full mx-auto w-full grid-cols-[minmax(0,1fr)_54px] items-center overflow-visible rounded-full border-2 border-[color:var(--primary-color)] bg-[color:var(--surface-color)] lg:col-auto lg:grid lg:max-w-[760px] lg:grid-cols-[minmax(0,1fr)_220px_58px]`}
					>
						<input
							type="search"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Buscar jogos, categorias ou publicadoras"
							className="min-w-0 self-stretch rounded-l-full bg-transparent px-5 py-3 text-sm text-[color:var(--text-muted-color)] outline-none placeholder:text-[color:var(--text-soft-color)]"
						/>

						<div ref={categoryMenuRef} className="relative hidden h-full lg:flex">
							<button
								type="button"
								onClick={() => setIsCategoryMenuOpen((current) => !current)}
								className="flex h-full w-full items-center justify-between gap-3 border-l border-[color:var(--primary-color)] px-[18px] text-sm font-medium text-[color:var(--text-primary-color)]"
								aria-haspopup="listbox"
								aria-expanded={isCategoryMenuOpen}
							>
								<span className="truncate">{selectedCategory}</span>
								<ChevronDown
									size={16}
									className={`shrink-0 transition-transform ${
										isCategoryMenuOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{isCategoryMenuOpen ? (
								<div
									className="absolute left-0 top-[calc(100%+12px)] z-20 w-full overflow-hidden rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)]"
									style={{ boxShadow: "var(--shadow-large)" }}
								>
									<div className="border-b border-[color:var(--border-color)] px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
										Categorias
									</div>

									<div className="max-h-80 overflow-y-auto py-2">
										{categories.map((category) => (
											<button
												key={category}
												type="button"
												onClick={() => handleCategorySelect(category)}
												className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-[color:var(--text-muted-color)] transition hover:bg-[color:var(--surface-soft-color)] hover:text-[color:var(--text-primary-color)]"
											>
												<span className="truncate">{category}</span>
												{category === selectedCategory ? (
													<span className="rounded-full bg-[color:var(--primary-soft-color)] px-2 py-0.5 text-[11px] font-bold text-[color:var(--text-primary-color)]">
														Atual
													</span>
												) : null}
											</button>
										))}
									</div>
								</div>
							) : null}
						</div>

						<button
							type="submit"
							aria-label="Pesquisar"
							className="inline-flex h-full items-center justify-center rounded-r-full border-l border-[color:var(--primary-color)] bg-[color:var(--primary-color)] !text-[color:var(--primary-ui-text-color)] transition hover:bg-[color:var(--primary-hover-color)]"
						>
							<Search size={18} />
						</button>
					</form>

					<div className="hidden items-center gap-[6px] lg:flex" aria-label="Ações da conta">
						{sessionUser ? (
							<Link
								to="/my-wishlist"
								aria-label="Lista de favoritos"
								className="relative inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-transparent px-2 text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-light-color)] hover:text-[color:var(--text-primary-color)]"
							>
								<Heart size={18} />
								{wishlistCount > 0 ? (
									<span className="absolute right-0 top-0 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--primary-color)] px-1 text-[10px] font-bold text-[color:var(--text-on-primary-color)]">
										{wishlistCount}
									</span>
								) : null}
							</Link>
						) : (
							<button
								type="button"
								aria-label="Entrar para acessar favoritos"
								onClick={() =>
									navigate("/login", {
										state: { redirectTo: "/my-wishlist" },
									})
								}
								className="relative inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-transparent px-2 text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-light-color)] hover:text-[color:var(--text-primary-color)]"
							>
								<Heart size={18} />
							</button>
						)}

						{sessionUser ? (
							<Link
								to="/my-account"
								aria-label="Conta"
								className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-transparent px-2 text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-light-color)] hover:text-[color:var(--text-primary-color)]"
							>
								<User size={18} />
							</Link>
						) : (
							<button
								type="button"
								aria-label="Entrar para acessar sua conta"
								onClick={() =>
									navigate("/login", {
										state: { redirectTo: "/my-account" },
									})
								}
								className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-transparent px-2 text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-light-color)] hover:text-[color:var(--text-primary-color)]"
							>
								<User size={18} />
							</button>
						)}

						<button
							type="button"
							aria-label="Carrinho"
							onClick={handleCartOpen}
							className="relative inline-flex items-center gap-1 rounded-full px-2 py-1 text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-light-color)] hover:text-[color:var(--text-primary-color)]"
						>
							<div className="relative inline-flex h-[42px] w-[42px] items-center justify-center rounded-full">
								<ShoppingBag size={18} />
								{cartCount > 0 ? (
									<span className="absolute right-0 top-0 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--primary-color)] px-1 text-[10px] font-bold text-[color:var(--text-on-primary-color)]">
										{cartCount}
									</span>
								) : null}
							</div>

							<strong className="text-sm font-semibold text-[color:var(--text-primary-color)]">
								{formatCurrency(cartTotal)}
							</strong>
						</button>
					</div>
				</div>
			</div>

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
		</header>
	);
}
