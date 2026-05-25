function joinClasses(...classNames) {
	return classNames.filter(Boolean).join(" ");
}

export default function SecondaryButton({
	children,
	icon: Icon,
	iconPosition = "left",
	className = "",
	type = "button",
	...props
}) {
	return (
		<button
			type={type}
			className={joinClasses(
				"inline-flex h-[50px] min-w-[220px] items-center justify-center gap-[5px] rounded-full border border-[color:var(--secondary-border-color,var(--border-light-color))] bg-transparent px-7 text-[15px] font-bold text-[color:var(--text-primary-color)] transition-[background-color,border-color,transform] duration-200 ease-linear hover:scale-[1.01] hover:border-[color:var(--primary-color)] hover:bg-[color:var(--surface-accent-hover-color,var(--surface-soft-color))] max-md:w-full max-md:min-w-0 max-md:px-[18px]",
				className
			)}
			{...props}
		>
			{Icon && iconPosition === "left" ? <Icon size={16} /> : null}
			{children}
			{Icon && iconPosition === "right" ? <Icon size={16} /> : null}
		</button>
	);
}
