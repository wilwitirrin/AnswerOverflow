import NextLink from 'next/link';

export default function Link(
	props: React.ComponentPropsWithoutRef<typeof NextLink> & {
		href: string;
	},
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { prefetch: _prefetch, ...rest } = props;
	// Next/Link adds .3 seconds to LCP
	return <a {...rest} />;
}
