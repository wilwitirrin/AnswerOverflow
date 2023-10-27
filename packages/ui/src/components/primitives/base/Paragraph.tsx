// import { twMerge } from 'tailwind-merge/src/lib/tw-merge';

export const Paragraph = (
	props: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>,
) => {
	const { children, className, ...otherProps } = props;

	return (
		<p className={'py-4 font-body text-lg text-primary'} {...otherProps}>
			{children}
		</p>
	);
};
