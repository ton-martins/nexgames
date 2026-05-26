import { useMemo } from "react";

function buildBrandList(games) {
	return [...new Set(games.map((game) => game.empresaNome).filter(Boolean))].slice(0, 10);
}

export default function Brands({ games = [] }) {
	const brandList = useMemo(() => buildBrandList(games), [games]);
	const hasMarquee = brandList.length > 1;

	if (!brandList.length) {
		return null;
	}

	return (
		<section className="mt-[var(--section-spacing)]">
			<div className="app-container">
				<div className="overflow-hidden py-3">
					<div
						className={`flex w-max ${
							hasMarquee
								? "animate-[brands-marquee_28s_linear_infinite] hover:[animation-play-state:paused]"
								: ""
						}`}
					>
						{[0, 1].map((copyIndex) => (
							<div
								key={copyIndex}
								aria-hidden={copyIndex === 1}
								className="flex shrink-0 gap-[14px] pr-[14px]"
							>
								{brandList.map((brandName) => (
									<div
										key={`${brandName}-${copyIndex}`}
										className="inline-flex min-h-[62px] min-w-[220px] items-center justify-center rounded-[var(--radius-medium)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] px-6 text-center text-[20px] font-bold text-[color:var(--text-muted-color)] transition hover:-translate-y-[1px] hover:bg-[color:var(--surface-color)] hover:text-[color:var(--text-primary-color)]"
									>
										{brandName}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
