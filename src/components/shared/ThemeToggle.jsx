import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

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
	return getCurrentDocumentTheme() || getStoredTheme() || getPreferredTheme() || DEFAULT_THEME;
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

export default function ThemeToggle() {
	const [theme, setTheme] = useState(() => resolveTheme());

	useEffect(() => {
		setTheme(applyTheme(resolveTheme()));
	}, []);

	function handleToggle() {
		setTheme((currentTheme) =>
			applyTheme(
				currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
			)
		);
	}

	const isDark = theme === THEMES.DARK;

	return (
		<div className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 md:block">
			<button
				type="button"
				onClick={handleToggle}
				aria-label="Alternar tema claro e escuro"
				aria-pressed={isDark}
				className="relative grid h-[108px] w-[54px] grid-rows-2 rounded-full p-1"
				style={{
					background:
						"linear-gradient(180deg, var(--surface-soft-color) 0%, var(--surface-contrast-color) 100%)",
					boxShadow: "var(--shadow-large)",
				}}
			>
				<span className="relative z-10 flex items-center justify-center text-[color:var(--text-inverse-color)]">
					<Moon size={14} />
				</span>

				<span
					className={`relative z-10 flex items-center justify-center transition ${
						isDark
							? "text-[color:var(--text-inverse-color)]"
							: "text-[color:var(--surface-contrast-color)]"
					}`}
				>
					<Sun size={14} />
				</span>

				<span
					aria-hidden="true"
					className="absolute left-1 h-[46px] w-[46px] rounded-full transition-transform duration-200"
					style={{
						bottom: "4px",
						transform: isDark ? "translateY(-54px)" : "translateY(0)",
						background:
							"linear-gradient(180deg, var(--surface-color) 0%, var(--surface-soft-color) 100%)",
						boxShadow: "var(--shadow-soft)",
					}}
				/>
			</button>
		</div>
	);
}
