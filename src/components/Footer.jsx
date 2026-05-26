import {
	Globe,
	Headphones,
	MessageCircle,
	ShieldCheck,
	ShoppingBag,
	Star,
	Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

const FOOTER_COLUMN_LIST = [
	{
		title: "Institucional",
		linkList: ["Sobre a loja", "Política de privacidade", "Termos de uso", "Fale conosco"],
	},
	{
		title: "Catálogo",
		linkList: ["Lançamentos", "Mais vendidos", "Promoções", "Gift cards"],
	},
	{
		title: "Suporte",
		linkList: ["Minha conta", "Pedidos", "Pagamentos", "Ajuda e FAQ"],
	},
];

const SOCIAL_ICON_LIST = [
	Globe,
	MessageCircle,
	ShieldCheck,
	ShoppingBag,
	Star,
	Trophy,
];

const PAYMENT_LABELS = ["DISCOVER", "mastercard", "PayPal", "Skrill", "VISA"];

export default function Footer() {
	return (
		<footer className="bg-transparent pb-[22px] pt-8">
			<div className="app-container">
				<div className="grid gap-7 border-t border-[color:var(--border-color)] bg-transparent p-6 md:grid-cols-2 md:gap-[42px] md:p-[34px] xl:grid-cols-[minmax(260px,1.35fr)_repeat(3,minmax(170px,1fr))] xl:p-[44px]">
					<div className="xl:border-r xl:border-[color:var(--border-color)] xl:pr-8">
						<Link to="/" className="inline-flex bg-transparent p-0">
							<span className="text-5xl font-extrabold leading-none text-[color:var(--text-primary-color)] max-md:text-[38px]">
								NexGames<span className="text-[color:var(--primary-color)]">.</span>
							</span>
						</Link>

						<div className="mt-[18px] border-t border-[color:var(--border-light-color)] pt-4">
							<div className="flex flex-col gap-[18px]">
								<div className="flex items-center gap-3">
									<Headphones
										size={52}
										className="text-[color:var(--primary-color)]"
									/>
									<span className="text-[color:var(--text-muted-color)]">
										Fale com a loja
									</span>
								</div>

								<strong className="text-[20px] leading-[1.1] text-[color:var(--text-primary-color)] max-md:text-[22px]">
									(71) 3333-2026
								</strong>
							</div>
						</div>

						<div className="mt-[18px]">
							<strong className="text-base text-[color:var(--text-primary-color)]">
								Contato
							</strong>
							<p className="mb-0 mt-2 text-[color:var(--text-muted-color)]">
								Rua da Vitrine Digital, 404 - Salvador - BA
							</p>
						</div>

						<div className="mt-5 flex flex-wrap items-center gap-[10px]">
							{SOCIAL_ICON_LIST.map((Icon, index) => (
								<button
									key={index}
									type="button"
									aria-label="Rede social da loja"
									className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[var(--radius-medium)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] text-[color:var(--text-muted-color)] transition hover:bg-[color:var(--primary-color)] hover:text-[color:var(--primary-ui-text-color)]"
								>
									<Icon size={18} />
								</button>
							))}
						</div>
					</div>

					{FOOTER_COLUMN_LIST.map((column) => (
						<div
							key={column.title}
							className="border-t border-[color:var(--border-color)] pt-6 md:border-0 md:pt-0 xl:border-l xl:border-[color:var(--border-color)] xl:pl-8"
						>
							<h3 className="relative m-0 pb-3 text-[18px] text-[color:var(--text-primary-color)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[42px] after:bg-[color:var(--primary-color)] after:content-['']">
								{column.title}
							</h3>

							<nav className="mt-4 grid gap-3">
								{column.linkList.map((linkLabel) => (
									<button
										key={linkLabel}
										type="button"
										className="w-fit bg-transparent p-0 text-left text-base text-[color:var(--text-muted-color)] transition hover:translate-x-[3px] hover:text-[color:var(--secondary-color)] max-md:w-full"
									>
										{linkLabel}
									</button>
								))}
							</nav>
						</div>
					))}
				</div>

				<div className="mt-4 flex flex-col gap-4 border-t border-[color:var(--border-color)] px-4 py-[18px] md:px-[22px] xl:flex-row xl:items-center xl:justify-between xl:py-4">
					<span className="text-[color:var(--text-muted-color)]">
						Copyright © 2026 NexGames. Todos os direitos reservados.
					</span>

					<div className="flex flex-wrap items-center gap-2">
						{PAYMENT_LABELS.map((label) => (
							<span
								key={label}
								className="rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-2 py-1.5 text-center text-xs font-bold text-[color:var(--text-primary-color)] max-md:flex-[1_1_calc(50%-8px)]"
							>
								{label}
							</span>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
