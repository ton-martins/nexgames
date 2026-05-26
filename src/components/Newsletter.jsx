import { Send } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);

	function handleSubmit(event) {
		event.preventDefault();

		if (!email.trim()) {
			return;
		}

		setIsSubscribed(true);
		setEmail("");
	}

	return (
		<section className="mt-[52px] bg-[linear-gradient(90deg,var(--primary-color)_0%,var(--primary-light-color)_100%)] pb-[18px]">
			<div className="app-container grid min-h-[96px] gap-[18px] py-[22px] xl:grid-cols-[minmax(0,760px)_minmax(420px,700px)] xl:items-center">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-[5px] text-[color:var(--primary-ui-text-color)]">
						<Send size={24} />
						<strong className="text-[25px] font-normal">
							Assine a newsletter gamer
						</strong>
					</div>

					<span className="text-[18px] text-[color:var(--primary-ui-text-color)]">
						Receba cupons, novidades e promoções do universo dos games e do entretenimento digital.
					</span>
				</div>

				<form
					onSubmit={handleSubmit}
					className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_138px]"
				>
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="Digite seu melhor e-mail"
						className="h-[52px] rounded-[var(--radius-medium)] bg-[color:var(--surface-color)] px-[22px] text-[18px] text-[color:var(--text-primary-color)] outline-none xl:rounded-l-[var(--radius-large)] xl:rounded-r-none"
					/>

					<button
						type="submit"
						className="h-[52px] rounded-[var(--radius-medium)] !bg-[color:var(--surface-contrast-color)] text-base font-bold !text-[color:var(--text-on-contrast-color)] xl:rounded-l-none xl:rounded-r-[var(--radius-large)]"
					>
						Cadastrar
					</button>
				</form>
			</div>

			{isSubscribed ? (
				<div className="app-container">
					<p className="m-0 pb-2 text-sm font-medium text-[color:var(--primary-ui-text-color)]">
						E-mail cadastrado com sucesso.
					</p>
				</div>
			) : null}
		</section>
	);
}
