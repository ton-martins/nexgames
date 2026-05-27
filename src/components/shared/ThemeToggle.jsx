import { useEffect, useRef, useState } from "react";
import { Check, Moon, Sun } from "lucide-react";

const THEMES = {
	LIGHT: "light",
	DARK: "dark",
};

const DEFAULT_THEME = THEMES.LIGHT;
const THEME_STORAGE_KEY = "nexgames_theme";

function isValidTheme(theme) {
	return theme === THEMES.LIGHT || theme === THEMES.DARK;
}

function getStoredTheme() {
	if (typeof window === "undefined") {
		return null;
	}

	const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
	return isValidTheme(storedTheme) ? storedTheme : null;
}

function getPreferredTheme() {
	if (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		return THEMES.DARK;
	}

	return THEMES.LIGHT;
}

function getCurrentDocumentTheme() {
	if (typeof document === "undefined") {
		return null;
	}

	const currentTheme = document.documentElement.getAttribute("data-theme");
	return isValidTheme(currentTheme) ? currentTheme : null;
}

function resolveTheme() {
	return (
		getCurrentDocumentTheme() ||
		getStoredTheme() ||
		getPreferredTheme() ||
		DEFAULT_THEME
	);
}

function applyTheme(theme) {
	if (typeof document === "undefined" || typeof window === "undefined") {
		return DEFAULT_THEME;
	}

	const validTheme = theme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;
	document.documentElement.setAttribute("data-theme", validTheme);
	window.localStorage.setItem(THEME_STORAGE_KEY, validTheme);

	return validTheme;
}

function joinClasses(...classNames) {
	return classNames.filter(Boolean).join(" ");
}

export default function ThemeToggle({ className = "" }) {
	const containerRef = useRef(null);
	const [theme, setTheme] = useState(() => resolveTheme());
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setTheme(applyTheme(resolveTheme()));
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}

		function handleClickOutside(event) {
			if (!containerRef.current?.contains(event.target)) {
				setIsOpen(false);
			}
		}

		function handleEscape(event) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	function handleSelectTheme(nextTheme) {
		setTheme(applyTheme(nextTheme));
		setIsOpen(false);
	}

	const TriggerIcon = theme === THEMES.DARK ? Moon : Sun;

	return (
		<div ref={containerRef} className={joinClasses("relative", className)}>
			<button
				type="button"
				onClick={() => setIsOpen((current) => !current)}
				aria-label="Abrir seletor de tema"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-transparent text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-light-color)] hover:text-[color:var(--text-primary-color)]"
			>
				<TriggerIcon size={18} />
			</button>

			{isOpen ? (
				<div
					role="menu"
					aria-label="Selecionar tema"
					className="absolute right-0 top-[calc(100%+10px)] z-40 min-w-[176px] overflow-hidden rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-2"
					style={{ boxShadow: "var(--shadow-large)" }}
				>
					<button
						type="button"
						role="menuitemradio"
						aria-checked={theme === THEMES.LIGHT}
						onClick={() => handleSelectTheme(THEMES.LIGHT)}
						className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-medium)] px-3 py-2.5 text-left text-sm text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--surface-soft-color)]"
					>
						<span className="inline-flex items-center gap-2">
							<Sun size={16} />
							<span>Claro</span>
						</span>
						{theme === THEMES.LIGHT ? <Check size={16} /> : null}
					</button>

					<button
						type="button"
						role="menuitemradio"
						aria-checked={theme === THEMES.DARK}
						onClick={() => handleSelectTheme(THEMES.DARK)}
						className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-medium)] px-3 py-2.5 text-left text-sm text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--surface-soft-color)]"
					>
						<span className="inline-flex items-center gap-2">
							<Moon size={16} />
							<span>Escuro</span>
						</span>
						{theme === THEMES.DARK ? <Check size={16} /> : null}
					</button>
				</div>
			) : null}
		</div>
	);
}
