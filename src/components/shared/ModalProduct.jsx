import { CalendarDays, Search, ShoppingBag, X } from "lucide-react";
import { formatCurrency } from "../../helpers/currency";
import PrimaryButton from "./PrimaryButton";
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
						<div
							className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[var(--radius-large)] min-[1181px]:min-h-[320px]"
							style={{
								background: `linear-gradient(135deg, ${product.startColor} 0%, ${product.endColor} 100%)`,
							}}
						>
							<div className="absolute aspect-square w-[62%] rounded-full bg-white/45 blur-lg" />

							<div
								className="relative z-10 h-[66%] w-[58%] rounded-[22px] border border-white/35"
								style={{
									background:
										"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
									transform: "rotate(-14deg)",
									boxShadow: "var(--shadow-float)",
								}}
							/>

							<div className="absolute bottom-[18px] left-[18px] grid max-w-[62%] gap-0.5 text-[color:var(--text-inverse-color)]">
								<span className="text-[11px] font-bold tracking-[0.08em] opacity-90">
									{product.empresaNome}
								</span>
								<strong className="text-[15px] leading-[1.05]">
									{product.categoria}
								</strong>
							</div>
						</div>
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
							<PrimaryButton icon={ShoppingBag} onClick={onPrimaryAction}>
								Comprar agora
							</PrimaryButton>

							<SecondaryButton icon={Search} onClick={onSecondaryAction}>
								Ver categoria
							</SecondaryButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
