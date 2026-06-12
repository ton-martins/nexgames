import { useEffect, useState } from "react";

function buildArtworkBackground({ background, startColor, endColor, softGradient }) {
	if (background) {
		return background;
	}

	if (!startColor || !endColor) {
		return "linear-gradient(135deg, var(--surface-soft-color) 0%, var(--surface-color) 100%)";
	}

	if (softGradient) {
		return `linear-gradient(135deg, color-mix(in srgb, ${startColor} 82%, var(--surface-color)), color-mix(in srgb, ${endColor} 88%, var(--surface-soft-color)))`;
	}

	return `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
}

export default function ProductArtwork({
	image = null,
	alt = "",
	primaryLabel = "",
	secondaryLabel = "",
	className = "",
	imageClassName = "",
	labelPositionClassName = "bottom-[18px] left-[18px]",
	textContainerClassName = "max-w-[62%]",
	primaryLabelClassName = "text-[11px] font-bold tracking-[0.08em] opacity-90",
	secondaryLabelClassName = "text-[15px] leading-[1.05]",
	placeholderClassName = "relative z-10 h-[68%] w-[58%] rounded-[22px] border border-white/35",
	placeholderStyle = undefined,
	glowClassName = "absolute aspect-square w-[62%] rounded-full bg-white/45 blur-lg",
	showGlow = true,
	showImageOverlay = true,
	imageOverlayClassName = "absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent",
	startColor = "",
	endColor = "",
	background = "",
	softGradient = true,
}) {
	const hasLabels = Boolean(primaryLabel || secondaryLabel);
	const [hasImageError, setHasImageError] = useState(false);
	const hasImage = Boolean(image) && !hasImageError;

	useEffect(() => {
		setHasImageError(false);
	}, [image]);

	return (
		<div
			className={`relative flex items-center justify-center overflow-hidden rounded-[var(--radius-large)] ${className}`}
			style={{
				background: buildArtworkBackground({
					background,
					startColor,
					endColor,
					softGradient,
				}),
			}}
		>
			{hasImage ? (
				<>
					<img
						src={image}
						alt={alt || secondaryLabel || primaryLabel || "Artwork do jogo"}
						className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
						onError={() => setHasImageError(true)}
					/>
					{showImageOverlay ? <div className={imageOverlayClassName} /> : null}
				</>
			) : (
				<>
					{showGlow ? <div className={glowClassName} /> : null}
					<div className={placeholderClassName} style={placeholderStyle} />
				</>
			)}

			{hasLabels ? (
				<div
					className={`absolute ${labelPositionClassName} grid gap-0.5 text-[color:var(--text-inverse-color)] ${textContainerClassName}`}
				>
					{primaryLabel ? (
						<span className={primaryLabelClassName}>{primaryLabel}</span>
					) : null}
					{secondaryLabel ? (
						<strong className={secondaryLabelClassName}>{secondaryLabel}</strong>
					) : null}
				</div>
			) : null}
		</div>
	);
}
