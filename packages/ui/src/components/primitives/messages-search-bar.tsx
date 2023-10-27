'use client';
import { useRouter } from 'next/navigation';
import { useRouterQuery, useRouterServerId } from '~ui/utils/hooks';
import { useState } from 'react';
// import { twMerge } from 'tailwind-merge/src/lib/tw-merge';
import { Input } from '~ui/components/primitives/ui/input';

export const MessagesSearchBar = (props: {
	placeholder?: string;
	className?: string;
	serverId?: string;
}) => {
	const router = useRouter();
	const query = useRouterQuery();
	const serverId = useRouterServerId();
	const [searchInput, setSearchInput] = useState<string>(query ?? '');
	return (
		<form
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			onSubmit={(e) => {
				e.preventDefault();
				const params = new URLSearchParams();
				params.set('q', searchInput);
				const serverIdToFilterTo = props.serverId ?? serverId;
				if (serverIdToFilterTo) {
					params.set('s', serverIdToFilterTo);
				}
				router.push(`/search?${params.toString()}`);
			}}
			className={'w-full'}
		>
			<Input
				defaultValue={query || ''}
				className={'mb-4 w-full'}
				onChange={(e) => setSearchInput(e.target.value)}
				placeholder={props.placeholder ?? 'Search'}
				type={'search'}
			/>
		</form>
	);
};
