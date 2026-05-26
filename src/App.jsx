import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";
import ThemeToggle from "./components/shared/ThemeToggle";

export default function App() {
	return (
		<BrowserRouter>
			<ThemeToggle />
			<AppRoutes />
		</BrowserRouter>
	);
}
