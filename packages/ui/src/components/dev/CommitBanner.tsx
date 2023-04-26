import Link from 'next/link';
import { Heading } from '../primitives';

export const CommitBanner = () => {
	if (
		process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'staging' &&
		process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA &&
		process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.length > 0
	)
		return (
			<CommitBannerRenderer
				commitSha={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
			/>
		);
	else return null;
};

export const CommitBannerRenderer = ({ commitSha }: { commitSha: string }) => {
	return (
		<div className="flex w-full flex-row justify-between bg-white px-4 dark:bg-black md:px-10">
			<Heading.H2 className="font-body text-sm md:text-lg">
				<span className="align-middle text-black dark:text-white">
					Commit:{' '}
				</span>
				<span className="align-middle text-ao-black/75 dark:text-ao-white/75">
					{commitSha}
				</span>
			</Heading.H2>
			<Heading.H3 className="hidden font-body text-lg md:block">
				<Link href="https://vercel.com">
					Currently running on Vercel Preview
				</Link>
			</Heading.H3>
		</div>
	);
};