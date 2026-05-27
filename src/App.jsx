import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";
import MenuBottom from "./components/MenuBottom";

export default function App() {
	return (
		<BrowserRouter>
			<AppRoutes />
			<MenuBottom />
		</BrowserRouter>
	);
}
