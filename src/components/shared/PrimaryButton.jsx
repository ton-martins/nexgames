function joinClasses(...classNames) {
	return classNames.filter(Boolean).join(" ");
}

export default function PrimaryButton({
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
				"inline-flex h-[50px] min-w-[220px] items-center justify-center gap-[5px] rounded-full border-0 bg-[color:var(--primary-color)] px-7 text-[15px] font-bold !text-[color:var(--primary-ui-text-color)] transition-[background-color,transform] duration-200 ease-linear hover:scale-[1.01] hover:bg-[color:var(--primary-hover-color)] max-md:w-full max-md:min-w-0 max-md:px-[18px]",
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
