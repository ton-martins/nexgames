function joinClasses(...classNames) {
	return classNames.filter(Boolean).join(" ");
}

export default function TertiaryButton({
	icon: Icon,
	className = "",
	type = "button",
	size = "md",
	...props
}) {
	const sizeClassName =
		size === "sm" ? "h-9 w-9 rounded-xl" : "h-[42px] w-[42px] rounded-[14px]";

	return (
		<button
			type={type}
			className={joinClasses(
				"inline-flex items-center justify-center border border-[color:var(--primary-color)] bg-[color:var(--primary-color)] text-[color:var(--text-on-primary-color)] transition hover:bg-[color:var(--primary-hover-color)]",
				sizeClassName,
				className
			)}
			{...props}
		>
			{Icon ? <Icon size={18} /> : null}
		</button>
	);
}
