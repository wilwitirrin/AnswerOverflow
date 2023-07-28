import { useOnboardingContext } from './OnboardingContext';
import { trpc } from '~ui/utils/trpc';
import type { ServerPublic } from '@answeroverflow/api';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
	AcademicCapIcon,
	ChatBubbleLeftIcon,
	CheckCircleIcon,
	CodeBracketIcon,
	MagnifyingGlassCircleIcon,
} from '@heroicons/react/24/outline';
import { IoGameControllerOutline } from 'react-icons/io5';
import { MdMoneyOffCsred, MdAttachMoney } from 'react-icons/md';
import { CiCircleMore } from 'react-icons/ci';
import { usePostHog } from 'posthog-js/react';
import { Command } from '~ui/components/primitives/base/Command';
import { Button } from '~ui/components/primitives/ui/button';
import { ServerIcon } from '~ui/components/primitives/ServerIcon';
import { Heading } from '~ui/components/primitives/base/Heading';
import { AOLink } from '~ui/components/primitives/base/Link';
import { ManageServerCard } from '~ui/components/primitives/ServerCard';
import { SignInButton } from '~ui/components/primitives/Callouts';
import { LinkButton } from '~ui/components/primitives/base/LinkButton';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~ui/components/primitives/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~ui/components/primitives/ui/form';
import {
	RadioGroup,
	RadioGroupItem,
} from '~ui/components/primitives/ui/radio-group';
import { Input } from '~ui/components/primitives/ui/input';
import { OnboardingPage } from '~ui/components/pages/onboarding/OnboardingContext';

export function WaitingToBeAdded() {
	const { data } = useOnboardingContext();
	const [lastChecked, setLastChecked] = useState(Date.now());
	const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

	const { status } = trpc.servers.byId.useQuery(data.server!.id, {
		refetchInterval: 5000,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: true,
		onError() {
			setLastChecked(Date.now());
		},
		onSuccess() {
			setLastChecked(Date.now());
		},
	});

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTimestamp(Date.now());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const secondsSinceLastChecked = Math.floor(
		(currentTimestamp - lastChecked) / 1000,
	);

	return (
		<WaitingToBeAddedRenderer
			server={data.server!}
			timeSinceLastCheckInSeconds={
				secondsSinceLastChecked > 0 ? secondsSinceLastChecked : 0
			}
			hasJoined={status === 'success'}
		/>
	);
}

const formSchema = z
	.object({
		reason: z.enum(['learn-more', 'different-server', 'other', 'setup-issue']),
		description: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.reason === 'other') {
				return data.description !== undefined && data.description.length > 1;
			} else {
				return true;
			}
		},
		{
			message: 'Please provide a cancellation reason',
			path: ['description'],
		},
	);

export function WaitingToBeAddedRenderer(props: {
	server: ServerPublic;
	timeSinceLastCheckInSeconds: number;
	hasJoined: boolean;
}) {
	const { goToPage } = useOnboardingContext();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: '',
			reason: 'learn-more',
		},
	});
	if (props.hasJoined) {
		return (
			<div className="flex flex-col items-center justify-center gap-8 text-center">
				<Heading.H1>Joined {props.server.name}!</Heading.H1>
				<ServerIcon size={128} server={props.server} />
				<Button
					size={'lg'}
					onClick={() => {
						goToPage('what-topic');
					}}
				>
					Continue
				</Button>
			</div>
		);
	}
	function onSubmit(values: z.infer<typeof formSchema>) {
		// TODO: Use the preset reasons to recover from this by redirecting to a relevant page
		console.log(values);
		goToPage('start');
	}
	return (
		<div className="flex flex-col items-center justify-center gap-8 text-center">
			<Heading.H1>Waiting to join {props.server.name}</Heading.H1>
			<div className="h-32 w-32 animate-spin rounded-full border-b-4 border-highlight" />
			<span>
				Last checked {props.timeSinceLastCheckInSeconds} second
				{props.timeSinceLastCheckInSeconds === 1 ? '' : 's'} ago.
			</span>
			<div className="flex w-full flex-row justify-between gap-8">
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>Cancel</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<Form {...form}>
							<form
								// eslint-disable-next-line @typescript-eslint/no-misused-promises
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full space-y-3"
							>
								<DialogHeader>
									<DialogTitle>Cancel</DialogTitle>
									<DialogDescription>
										Why are you cancelling the onboarding process?
									</DialogDescription>
								</DialogHeader>
								<FormField
									control={form.control}
									name="reason"
									render={({ field }) => (
										<FormItem className="space-y-3">
											<FormLabel>Reason</FormLabel>
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													defaultValue={field.value}
													className="flex flex-col space-y-4"
												>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem value="learn-more" />
														</FormControl>
														<FormLabel className="font-normal">
															I need to learn more about Answer Overflow
														</FormLabel>
													</FormItem>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem value="different-server" />
														</FormControl>
														<FormLabel className="font-normal">
															I picked the wrong server to add Answer Overflow
															to
														</FormLabel>
													</FormItem>
													<FormItem className="flex items-center space-x-3 space-y-0">
														<FormControl>
															<RadioGroupItem value="setup-issue" />
														</FormControl>
														<FormLabel className="font-normal">
															I've encountered an issue with setup
														</FormLabel>
													</FormItem>

													{form.getValues().reason === 'other' ? (
														<>
															<FormField
																control={form.control}
																name="description"
																render={({ field }) => (
																	<FormItem>
																		<div
																			className={
																				'flex flex-row items-center gap-2 space-y-0'
																			}
																		>
																			<RadioGroupItem value="other" />
																			<FormControl>
																				<Input
																					placeholder="Cancel reason"
																					{...field}
																				/>
																			</FormControl>
																		</div>
																		<FormDescription className={'sr-only'}>
																			This is your public display name.
																		</FormDescription>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</>
													) : (
														<>
															<FormItem className="flex items-center space-x-3 space-y-0">
																<FormControl>
																	<RadioGroupItem value="other" />
																</FormControl>
																<FormLabel className="font-normal">
																	Other
																</FormLabel>
															</FormItem>
														</>
													)}
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<DialogFooter className={'w-full'}>
									<div className={'mt-4 flex w-full flex-row justify-between'}>
										<Button
											type="button"
											variant={'outline'}
											onClick={() => {
												console.log('clicked');
												setIsDialogOpen(false);
											}}
										>
											Return to Setup
										</Button>
										<Button type="submit">Cancel Onboarding</Button>
									</div>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
				<LinkButton
					href={`https://discord.com/oauth2/authorize?client_id=958907348389339146&permissions=328565083201&scope=bot+applications.commands&guild_id=${props.server.id}&disable_guild_select=true`}
					target={'Blank'}
					referrerPolicy="no-referrer"
					variant={'outline'}
					onMouseDown={() => {}}
				>
					Invite URL
				</LinkButton>
			</div>
		</div>
	);
}

function ButtonMenu(props: {
	options: {
		label: React.ReactNode;
		icon: React.ReactNode;
		value: string;
	}[];
	onSelect: (value: string) => void;
}) {
	return (
		<div className="mx-auto grid max-w-md grid-cols-1 items-center justify-items-center gap-8 py-8 md:grid-cols-2">
			{props.options.map((option) => {
				return (
					<Button
						className="grid h-32 w-32 grid-cols-1"
						key={option.value}
						onClick={() => {
							props.onSelect(option.value);
						}}
					>
						{option.icon}
						{option.label}
					</Button>
				);
			})}
		</div>
	);
}

export function WhatIsYourCommunityAbout() {
	const { goToPage, setData, data } = useOnboardingContext();
	return (
		<div>
			<Heading.H1 className="py-8 text-4xl">
				What topic best fits your community?
			</Heading.H1>
			<ButtonMenu
				options={[
					{
						label: 'Education',
						icon: <AcademicCapIcon className="mx-auto h-12 w-12" />,
						value: 'Education',
					},
					{
						label: 'Software',
						icon: <CodeBracketIcon className="mx-auto h-12 w-12" />,
						value: 'Software',
					},
					{
						label: 'Gaming',
						icon: <IoGameControllerOutline className="mx-auto h-12 w-12" />,
						value: 'Gaming',
					},
					{
						label: 'Other',
						icon: <CiCircleMore className="mx-auto h-12 w-12" />,
						value: 'Other',
					},
				]}
				onSelect={(value) => {
					setData({
						...data,
						communityTopic: value as
							| 'Education'
							| 'Software'
							| 'Gaming'
							| 'Other',
					});
					goToPage('what-type-of-community');
				}}
			/>
		</div>
	);
}

export function WhatTypeOfCommunityDoYouHave() {
	const { goToPage, setData, data } = useOnboardingContext();
	return (
		<div>
			<Heading.H1 className="py-8 text-4xl">
				What type of community do you have?
			</Heading.H1>
			<ButtonMenu
				options={[
					{
						label: 'Non Commercial',
						icon: <MdMoneyOffCsred className="mx-auto h-12 w-12" />,
						value: 'Non-Commercial',
					},
					{
						label: 'Commercial',
						icon: <MdAttachMoney className="mx-auto h-12 w-12" />,
						value: 'Commercial',
					},
				]}
				onSelect={(value) => {
					setData({
						...data,
						communityType: value as 'Non-Commercial' | 'Commercial',
					});
					goToPage('enable-indexing');
				}}
			/>
		</div>
	);
}

const SetupPage = (props: {
	icon: React.ReactNode;
	title: React.ReactNode;
	description: React.ReactNode;
	command: string;
	bulletPoints: React.ReactNode[];
	nextPage: OnboardingPage;
}) => {
	const { goToPage } = useOnboardingContext();
	return (
		<div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 p-4">
			<div className="mx-auto flex flex-row gap-4 py-4">
				{props.icon}
				<div className="grid grid-cols-1">
					<Heading.H1 className="max-w-md py-4 text-4xl">
						{props.title}
					</Heading.H1>
					<div className="mx-auto">
						<Command command={props.command} />
					</div>
				</div>
			</div>
			<span className="text-lg">{props.description}</span>
			<ul className="list-inside list-disc py-4 text-left text-lg">
				{props.bulletPoints.map((bulletPoint, i) => (
					<li key={i} className="py-2">
						{bulletPoint}
					</li>
				))}
			</ul>
			<div className="">
				<Button
					onClick={() => {
						goToPage(props.nextPage);
					}}
				>
					Continue
				</Button>
			</div>
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function EnableIndexingPage() {
	return (
		<SetupPage
			icon={<MagnifyingGlassCircleIcon className="hidden h-32 w-32 md:block" />}
			title="Enable Indexing"
			description='Open the "Indexing Settings" menu via /channel-settings and click the "Enable Indexing" button'
			command="channel-settings"
			bulletPoints={[
				'Indexing starts from the beginning of your channel',
				'If you have a lot of posts it may take a few days for them to all be indexed',
				"If you're indexing a fourm channel, run this command in a thread of the forum channel",
			]}
			nextPage="enable-read-the-rules-consent"
		/>
	);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function EnableForumGuidelinesConsent() {
	return (
		<SetupPage
			icon={<ChatBubbleLeftIcon className="hidden h-32 w-32 md:block" />}
			title="Enable Forum Guidelines Consent"
			description='Open the "Indexing Settings" menu via /channel-settings and click the "Enable Forum Guidelines Consent" button'
			command="channel-settings"
			bulletPoints={[
				'Users have to provide consent for their messages to be shown publicly.',
				'Fourm guidelines consent marks users who post in the channel as consenting',
				'Users can manage their account with the /manage-account command.',
				<AOLink
					href="https://docs.answeroverflow.com/user-settings/displaying-messages"
					target="_blank"
					key={'displaying-messages'}
				>
					Learn more about displaying messages on Answer Overflow
				</AOLink>,
			]}
			nextPage="enable-mark-solution"
		/>
	);
}

export function EnableMarkSolution() {
	return (
		<SetupPage
			icon={<CheckCircleIcon className="hidden h-32 w-32 md:block" />}
			title="Enable Mark Solution"
			description='Open the "Help channel utilities" menu via /channel-settings and click the "Enable mark as solution" button'
			command="channel-settings"
			bulletPoints={[
				'This allows users to mark a message as the solution to a question.',
				`Anyone with the ManageThreads, ManageGuild, or Administrator permission can mark a message as the solution.`,
				'For normal users to mark a message as solved, they must be the question author',
				'You can manage who has access to this command in the integrations tab',
			]}
			nextPage="final-checklist"
		/>
	);
}

export function WelcomePage() {
	const session = useSession();
	const { data: servers } = trpc.auth.getServersForOnboarding.useQuery(
		undefined,
		{
			enabled: session.status === 'authenticated',
			onError: (err) => {
				if (err.data?.code === 'UNAUTHORIZED') {
					void signOut();
				}
			},
		},
	);
	return <WelcomePageRenderer authState={session.status} servers={servers} />;
}

export function WelcomePageRenderer(props: {
	authState: 'authenticated' | 'unauthenticated' | 'loading';
	servers?: {
		highestRole: 'Administrator' | 'Manage Guild' | 'Owner';
		hasBot: boolean;
		id: string;
		name: string;
		icon: string | null;
		owner: boolean;
		permissions: number;
		features: string[];
	}[];
}) {
	const { goToPage, setData } = useOnboardingContext();

	const posthog = usePostHog();

	useEffect(() => {
		posthog?.startSessionRecording();
	}, [posthog]);

	switch (props.authState) {
		case 'authenticated':
			return (
				<div>
					<Heading.H1 className="py-8 text-4xl">
						Select a server to get started
					</Heading.H1>
					<div className="grid max-h-vh60 max-w-4xl grid-cols-1 gap-16 overflow-y-scroll p-8 md:grid-cols-3 ">
						{props.servers?.map((server) => (
							<div key={server.id}>
								<ManageServerCard
									server={{
										...server,
										description: null,
										vanityUrl: null,
										vanityInviteCode: null,
										kickedTime: null,
										customDomain: null,
									}}
									onSetupClick={(clickedServer) => {
										// wait a second then go this page:
										setData({
											server: clickedServer,
										});
										setTimeout(() => {
											goToPage('waiting-to-be-added');
										}, 1000);
									}}
								/>
							</div>
						))}
					</div>
				</div>
			);
		case 'loading':
			return <div />;
		case 'unauthenticated':
			return (
				<div>
					<Heading.H1 className="text-4xl">
						Welcome to Answer Overflow!
					</Heading.H1>
					<Heading.H2 className="py-8 text-2xl">
						{"Let's"} get you signed in
					</Heading.H2>
					<SignInButton className="w-64 " variant="default" />
				</div>
			);
	}
}

export function FinalChecklistPage() {
	const { data } = useOnboardingContext();
	return (
		<div>
			<Heading.H1>Setup Complete!</Heading.H1>
			<Heading.H2>{"Here's"} a few extra things you can do</Heading.H2>
			<ul className="list-inside list-disc py-4 text-left text-lg">
				<li>
					Make an announcement post in your server to let people {"you've "}
					started indexing your channels
				</li>
				<li>
					Link your Answer Overflow page in your documentation / GitHub to
					improve your performance in search results
				</li>
				<li>
					Browse{' '}
					<AOLink
						href="https://docs.answeroverflow.com"
						className={'underline'}
					>
						the documentation
					</AOLink>{' '}
					to learn more about Answer Overflow
				</li>
			</ul>
			<div className="mx-auto py-4">
				<LinkButton href={`/dashboard/${data.server!.id}`}>
					View Dashboard
				</LinkButton>
			</div>
			<span>
				Your page may take some time to update due to caching & indexing times.
			</span>
		</div>
	);
}
