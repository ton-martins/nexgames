import { AlertCircle, X } from "lucide-react";

export default function FeedbackPopup({
	open = false,
	title = "",
	message = "",
	onClose,
}) {
	if (!open) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-6">
			<div
				className="flex w-full max-w-lg items-start gap-3 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 py-4"
				style={{ boxShadow: "var(--shadow-large)" }}
				role="alertdialog"
				aria-live="assertive"
			>
				<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--danger-color)]">
					<AlertCircle size={20} />
				</div>

				<div className="min-w-0 flex-1">
					<strong className="block text-base font-black text-[color:var(--text-primary-color)]">
						{title}
					</strong>
					<p className="mt-1 text-sm leading-6 text-[color:var(--text-muted-color)]">
						{message}
					</p>
				</div>

				<button
					type="button"
					onClick={onClose}
					aria-label="Fechar aviso"
					className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[color:var(--text-muted-color)] transition hover:bg-[color:var(--surface-soft-color)] hover:text-[color:var(--text-primary-color)]"
				>
					<X size={18} />
				</button>
			</div>
		</div>
	);
}
