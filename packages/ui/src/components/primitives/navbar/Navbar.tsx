import Link from '~ui/components/primitives/base/Link';
import React, { Fragment, Suspense } from 'react';
import { GetStarted } from '../Callouts';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { GitHubIcon } from '../base/Icons';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { GITHUB_LINK } from '@answeroverflow/constants/src/links';
import { ServerIcon } from '../ServerIcon';
import { AnswerOverflowLogo } from '~ui/components/primitives/base/AnswerOverflowLogo';
import type { ServerPublic } from '@answeroverflow/api/src/router/server/types';
import { LinkButton } from '~ui/components/primitives/base/LinkButton';
import { SignInButton } from '~ui/components/primitives/navbar/sign-in-button';

import { getServerSession } from '@answeroverflow/auth';
import dynamic from 'next/dynamic';
const UserAvatar = dynamic(
	() => import('./user-dropdown').then((mod) => mod.UserAvatar),
	{ ssr: false },
);
export async function UserSection(props: { tenant: ServerPublic | undefined }) {
	const session = await getServerSession();
	return (
		<Fragment>
			<SignInButton tenant={props.tenant} />
		</Fragment>
	);
}

export const Navbar = (props: {
	tenant: ServerPublic | undefined;
	hideIcon?: boolean;
}) => {
	const { tenant } = props;

	return (
		<nav
			className={
				'relative z-10  flex min-h-[4rem] w-full flex-1 items-center justify-between px-3 sm:px-[4rem] md:py-2 2xl:px-[6rem]'
			}
		>
			<Link href="/" className={props.hideIcon ? 'hidden' : ''}>
				{tenant ? (
					<div className="flex items-center space-x-2">
						<ServerIcon server={tenant} />
						<span className="font-bold">{tenant.name}</span>
					</div>
				) : (
					<>
						<div className={'w-40 md:w-56'}>
							<AnswerOverflowLogo width={'full'} />
						</div>
						<span className="sr-only">Answer Overflow Logo</span>
					</>
				)}
			</Link>
			<div className="flex items-center gap-2">
				<ThemeSwitcher />
				<LinkButton variant={'ghost'} size={'icon'} href={'/search'}>
					<MagnifyingGlassIcon className="h-8 w-8 " />
					<span className="sr-only">Search Answer Overflow</span>
				</LinkButton>
				{!tenant && (
					<>
						<LinkButton
							className={'hidden md:flex'}
							variant={'ghost'}
							size={'icon'}
							href={GITHUB_LINK}
							target="_blank"
						>
							<GitHubIcon className="h-8 w-8" />
							<span className="sr-only">GitHub</span>
						</LinkButton>
						<GetStarted className={'hidden md:block'} location="Navbar" />
					</>
				)}
				<UserSection tenant={tenant} />
			</div>
		</nav>
	);
};
