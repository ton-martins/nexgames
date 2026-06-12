import { CalendarDays, Eye, ShoppingBag, X } from "lucide-react";
import { formatCurrency } from "../../helpers/currency";
import PrimaryButton from "./PrimaryButton";
import ProductArtwork from "./ProductArtwork";
import SecondaryButton from "./SecondaryButton";

function createProductMeta(product) {
	const yearLabel = product?.ano ? String(product.ano) : "Catálogo ativo";
	return `${yearLabel} • ${product?.empresaNome ?? "NexGames"}`;
}

export default function ModalProduct({
	product = null,
	onClose,
	onPrimaryAction,
	onSecondaryAction,
	primaryActionLabel = "Comprar agora",
	primaryActionIcon: PrimaryActionIcon = ShoppingBag,
}) {
	if (!product) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-[90] grid place-items-center bg-[color:var(--overlay-color)] p-5 backdrop-blur"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-product-title"
				className="relative w-full max-w-[920px] rounded-[18px] bg-[color:var(--surface-color)] p-7 shadow-[var(--shadow-large)]"
				onClick={(event) => event.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					aria-label="Fechar detalhes do jogo"
					className="absolute right-3.5 top-3.5 inline-flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)]"
				>
					<X size={18} />
				</button>

				<div className="grid gap-6 min-[1181px]:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
					<div className="relative min-h-[260px] min-[1181px]:min-h-[320px]">
						<ProductArtwork
							image={product.image}
							alt={product.nome}
							primaryLabel={product.empresaNome}
							secondaryLabel={product.categoria}
							className="min-h-[260px] min-[1181px]:min-h-[320px]"
							placeholderClassName="relative z-10 h-[66%] w-[58%] rounded-[22px] border border-white/35"
							placeholderStyle={{
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
								transform: "rotate(-14deg)",
								boxShadow: "var(--shadow-float)",
							}}
							startColor={product.startColor}
							endColor={product.endColor}
							softGradient={false}
						/>
					</div>

					<div className="grid content-start gap-[14px]">
						<span className="text-[13px] text-[color:var(--text-muted-color)]">
							{product.categoria}
						</span>

						<h2
							id="modal-product-title"
							className="m-0 text-[26px] leading-[1.08] text-[color:var(--text-primary-color)] min-[1181px]:text-[32px]"
						>
							{product.nome}
						</h2>

						<p className="m-0 text-[15px] text-[color:var(--text-muted-color)]">
							{product.descricao}
						</p>

						<div className="flex flex-wrap items-center gap-3">
							<span className="inline-flex items-center gap-2 text-sm text-[color:var(--rating-color)]">
								<CalendarDays size={16} />
								{createProductMeta(product)}
							</span>

							<span className="inline-flex min-h-[34px] items-center rounded-full bg-[color:var(--primary-soft-color)] px-3.5 text-xs font-extrabold uppercase text-[color:var(--text-primary-color)]">
								{product.badge}
							</span>
						</div>

						<div className="grid gap-1.5">
							<strong className="text-[34px] font-bold text-[color:var(--text-primary-color)]">
								{formatCurrency(product.precoAtual)}
							</strong>

							{product.precoOriginal ? (
								<span className="text-[color:var(--text-muted-color)] line-through">
									{formatCurrency(product.precoOriginal)}
								</span>
							) : null}
						</div>

						<div className="mt-1 flex flex-wrap items-center gap-3">
							<PrimaryButton icon={PrimaryActionIcon} onClick={onPrimaryAction}>
								{primaryActionLabel}
							</PrimaryButton>

							<SecondaryButton icon={Eye} onClick={onSecondaryAction}>
								Ver produto
							</SecondaryButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
