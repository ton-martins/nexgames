import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Menu,
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
import { getPublicGames } from "../../services/gameService";
import { getWishlist } from "../../services/wishlistService";

const ALL_CATEGORIES_LABEL = "Todas as categorias";

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(value || 0));
}

function getUniqueCategories(games) {
    const categories = games.map((game) => game.categoria).filter(Boolean);

    return [...new Set(categories)].sort((a,b) => a.localeCompare(b, "pt-BR"));
}

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const sessionUser = useMemo(() => getSessionUser(), [location.pathname]);

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_LABEL);
    const [categories, setCategories] = useState([ALL_CATEGORIES_LABEL]);

    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function loadCategories() {
            try {
                const games = await getPublicGames();
                if (! isMounted) return;

                const uniqueCategories = getUniqueCategories(games);
                setCategories([ALL_CATEGORIES_LABEL, ...uniqueCategories]);
            } catch {
                if (! isMounted) return;
                setCategories([ALL_CATEGORIES_LABEL]);
            }
        }

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadHeaderActions() {
            if (! isAuthenticated()) {
                if (! isMounted) return;
                setWishlistCount(0);
                setCartCount(0);
                setCartTotal(0);
                return;
            }

            try {
                const [wishlist, cart] = await Promise.all([
                    getWishlist().catch(() => []),
                    getCart().catch(() => null) 
                ]);

                if (! isMounted) return;

                const items = Array.isArray(cart?.itens) ? cart.itens : [];
                const total = items.reduce((sum, item) => {
                    const itemPrice = Number(item?.jogo?.preco ?? 0);
                    return sum + itemPrice;
                }, 0);

                setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
                setCartCount(items.length);
                setCartTotal(total);
            } catch {
                if (! isMounted) return;
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

    function handleSearchSubmit(event) {
        event.preventDefault();

        const params = new URLSearchParams();

        if (searchTerm.trim()) {
            params.set("search", searchTerm.trim());
        }

        if (selectedCategory && selectedCategory !== ALL_CATEGORIES_LABEL) {
            params.set("categoria", selectedCategory);
        }

        navigate({
            pathname: "/",
            search: params.toString() ? `?${params.toString()}` : "",
        });

        setIsMobileSearchOpen(false);
        setIsDepartmentsOpen(false);
    }

    function handleCategoryShortcut(category) {
        const params = new URLSearchParams();

        if (category && category !== ALL_CATEGORIES_LABEL) {
            params.set("categoria", category);
        }

        navigate({
            pathname: "/",
            search: params.toString() ? `?${params.toString()}` : "",
        });

        setSelectedCategory(category);
        setIsDepartmentsOpen(false);
    }

    return (
        <header className="sticky top-0 z-30 border-b border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-primary-color)]">
            <div className="app-container">
            <div className="grid min-h-[88px] grid-cols-[1fr_auto] items-center gap-4 py-4 lg:grid-cols-[220px_52px_minmax(420px,1fr)_auto] lg:gap-[22px] lg:py-0">
            <Link
                to="/"
                aria-label="Ir para a página inicial"
                className="inline-flex items-center"
            >
                <span className="inline-flex items-center text-3xl font-extrabold leading-none lg:text-[38px]">
                <span className="text-[color:var(--text-primary-color)]">
                    Nexgames
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

            <div className="relative hidden lg:block">
                <button
                    type="button"
                    aria-label="Abrir departamentos"
                    onClick={() => setIsDepartmentsOpen((current) => !current)}
                    className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-transparent text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--icon-hover-background)] hover:text-[color:var(--secondary-color)]"
                >
                    <Menu size={18} />
                </button>

                {isDepartmentsOpen ? (
                    <div
                        className="absolute left-0 top-14 w-72 overflow-hidden rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)]"
                        style={{ boxShadow: "var(--shadow-large)" }}
                    >
                        <div className="border-b border-[color:var(--border-color)] px-4 py-3 text-sm font-semibold text-[color:var(--text-primary-color)]">
                        Departamentos
                        </div>

                        <div className="max-h-80 overflow-y-auto py-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryShortcut(category)}
                                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-[color:var(--text-muted-color)] transition hover:bg-[color:var(--surface-accent-hover-color)] hover:text-[color:var(--text-primary-color)]"
                            >
                            <span>{category}</span>
                            {category === selectedCategory ? (
                                <span className="text-xs text-[color:var(--primary-color)]">
                                Atual
                                </span>
                            ) : null}
                            </button>
                        ))}
                        </div>
                    </div>
                ) : null}
            </div>

            <form
                onSubmit={handleSearchSubmit}
                className={`${
                isMobileSearchOpen ? "grid" : "hidden"
                } col-span-full grid-cols-[minmax(0,1fr)_54px] overflow-hidden rounded-full border-2 border-[color:var(--primary-color)] bg-[color:var(--surface-color)] lg:col-auto lg:grid lg:h-11 lg:grid-cols-[minmax(0,1fr)_220px_58px]`}
            >
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar jogos, categorias ou publishers"
                    className="min-w-0 bg-transparent px-5 py-3 text-sm text-[color:var(--text-muted-color)] outline-none placeholder:text-[color:var(--text-soft-color)]"
                />

                <label className="hidden h-full items-center border-l border-[color:var(--primary-color)] px-[18px] lg:flex">
                <span className="sr-only">Selecionar categoria</span>
                <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="w-full bg-transparent text-sm text-[color:var(--text-primary-color)] outline-none"
                >
                    {categories.map((category) => (
                    <option
                        key={category}
                        value={category}
                        className="bg-[color:var(--surface-color)] text-[color:var(--text-primary-color)]"
                    >
                        {category}
                    </option>
                    ))}
                </select>
                </label>

                <button
                    type="submit"
                    aria-label="Pesquisar"
                    className="inline-flex items-center justify-center border-l border-[color:var(--primary-color)] bg-[color:var(--primary-color)] text-[color:var(--text-on-primary-color)] transition hover:bg-[color:var(--primary-hover-color)]"
                >
                    <Search size={18} />
                </button>
            </form>

            <div className="hidden items-center gap-[6px] lg:flex" aria-label="Acoes da conta">
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