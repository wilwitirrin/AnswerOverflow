import { ServerInvite } from '~ui/components/primitives/ServerInvite';

export default function Empty() {
	return (
		<>
			<h1>hello</h1>
			<ServerInvite
				server={{
					customDomain: '',
					name: 'AAAAAAAAA',
					id: '1037547185492996207',
					kickedTime: null,
					icon: '52184ce106b826e63ea7549e35b6150e',
					description: 'aaaaaaaaaaaaaaaaaaaaaa',
					vanityInviteCode: 'aaaaaaaaaaaaaaaaaaa',
					vanityUrl: 'aaaaaaaaaaaa',
				}}
				location={'Community Page'}
			/>
		</>
	);
}
