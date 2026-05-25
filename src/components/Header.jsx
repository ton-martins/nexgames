import { useEffect, useMemo, useRef, useState } from "react";
import {
	ChevronDown,
	Heart,
	RefreshCcw,
	Search,
	ShoppingBag,
	User,
	X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	getSessionUser,
	isAuthenticated,
} from "../../services/authService";
import { getCart } from "../../services/cartService";
import { getPublicGameCategories } from "../../services/gameService";
import { getWishlist } from "../../services/wishlistService";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";

const ALL_CATEGORIES_LABEL = "Todas as categorias";

export default function Header({ games = [] }) {
	const navigate = useNavigate();
	const location = useLocation();
	const categoryMenuRef = useRef(null);
	const sessionUser = useMemo(() => getSessionUser(), [location.pathname]);

	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_LABEL);
	const [wishlistCount, setWishlistCount] = useState(0);
	const [cartCount, setCartCount] = useState(0);
	const [cartTotal, setCartTotal] = useState(0);

	const categories = useMemo(() => {
		return [ALL_CATEGORIES_LABEL, ...getPublicGameCategories(games)];
	}, [games]);

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
			if (!isAuthenticated()) {
				if (!isMounted) return;
				setWishlistCount(0);
				setCartCount(0);
				setCartTotal(0);
				return;
			}

			try {
				const [wishlist, cart] = await Promise.all([
					getWishlist().catch(() => []),
					getCart().catch(() => null),
				]);

				if (!isMounted) return;

				const items = Array.isArray(cart?.itens) ? cart.itens : [];
				const total = items.reduce((sum, item) => {
					const itemPrice = Number(item?.jogo?.preco ?? 0);
					return sum + itemPrice;
				}, 0);

				setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
				setCartCount(items.length);
				setCartTotal(total);
			} catch {
				if (!isMounted) return;
				setWishlistCount(0);
				setCartCount(0);
				setCartTotal(0);
			}
		}

		loadHeaderActions();

		return () => {
			isMounted = false;
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
						className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-transparent text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--icon-hover-background)] hover:text-[color:var(--secondary-color)] lg:hidden"
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

						<div
							ref={categoryMenuRef}
							className="relative hidden h-full lg:flex"
						>
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
							className="inline-flex h-full items-center justify-center rounded-r-full border-l border-[color:var(--primary-color)] bg-[color:var(--primary-color)] text-[color:var(--text-on-primary-color)] transition hover:bg-[color:var(--primary-hover-color)]"
						>
							<Search size={18} />
						</button>
					</form>

					<div className="hidden items-center gap-[6px] lg:flex" aria-label="Ações da conta">
						<button
							type="button"
							aria-label="Itens vistos recentemente"
							title="Itens vistos recentemente"
							className="relative inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-transparent px-2 text-[color:var(--text-primary-color)] transition hover:text-[color:var(--secondary-color)]"
						>
							<RefreshCcw size={18} />
						</button>

						<Link
							to={sessionUser ? "/my-wishlist" : "/login"}
							aria-label="Lista de favoritos"
							className="relative inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-transparent px-2 text-[color:var(--text-primary-color)] transition hover:text-[color:var(--secondary-color)]"
						>
							<Heart size={18} />
							{wishlistCount > 0 ? (
								<span className="absolute right-0 top-0 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--primary-color)] px-1 text-[10px] font-bold text-[color:var(--text-on-primary-color)]">
									{wishlistCount}
								</span>
							) : null}
						</Link>

						<Link
							to={sessionUser ? "/my-account" : "/login"}
							aria-label="Conta"
							className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-transparent px-2 text-[color:var(--text-primary-color)] transition hover:text-[color:var(--secondary-color)]"
						>
							<User size={18} />
						</Link>

						<Link
							to={sessionUser ? "/cart" : "/login"}
							aria-label="Carrinho"
							className="relative inline-flex items-center gap-2 rounded-full px-2 text-[color:var(--text-primary-color)] transition hover:text-[color:var(--secondary-color)]"
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
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
