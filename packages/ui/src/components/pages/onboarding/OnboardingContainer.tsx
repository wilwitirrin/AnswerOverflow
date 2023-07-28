import { type OnboardingPage, SubmittedData } from './OnboardingContext';
import { useState } from 'react';
import React from 'react';
import { trackEvent } from '@answeroverflow/hooks';
import AOHead from '~ui/components/primitives/AOHead';
import { OnboardingContext } from './OnboardingContext';
import {
	EnableForumGuidelinesConsent,
	EnableIndexingPage,
	EnableMarkSolution,
	FinalChecklistPage,
	WaitingToBeAdded,
	WelcomePage,
	WhatIsYourCommunityAbout,
	WhatTypeOfCommunityDoYouHave,
} from '~ui/components/pages/onboarding/OnboardingPages';

const pageLookup: Record<OnboardingPage, React.FC> = {
	start: WelcomePage,
	'waiting-to-be-added': WaitingToBeAdded,
	'what-type-of-community': WhatTypeOfCommunityDoYouHave,
	'what-topic': WhatIsYourCommunityAbout,
	'enable-indexing': EnableIndexingPage,
	'enable-read-the-rules-consent': EnableForumGuidelinesConsent,
	'enable-mark-solution': EnableMarkSolution,
	'final-checklist': FinalChecklistPage,
};

export const OnboardingLanding = () => {
	// Eventually move this into the url
	const [currentPage, setCurrentPage] = useState<OnboardingPage>('start');
	const [data, setData] = useState<SubmittedData>({});
	const Page = pageLookup[currentPage];
	return (
		<>
			<AOHead
				title="Onboarding"
				description="Setup your server with AnswerOverflow."
				path="/onboarding"
			/>
			<div className="flex min-h-screen flex-col items-center justify-center text-center">
				<OnboardingContext.Provider
					value={{
						goToPage: (page) => {
							trackEvent(`Onboarding Page View - ${page}`, {
								'Page Name': page,
								'Server Id': data.server?.id ?? '',
								'Server Name': data.server?.name ?? '',
								'Community Topic': data.communityTopic,
								'Community Type': data.communityType,
							});
							setCurrentPage(page);
						},
						data,
						setData,
					}}
				>
					<Page />
				</OnboardingContext.Provider>
			</div>
		</>
	);
};
