import React from 'react';
import { ServerPublic } from '@answeroverflow/api';

export const pages = [
	'start',
	'waiting-to-be-added',
	'what-type-of-community',
	'what-topic',
	'enable-indexing',
	'enable-read-the-rules-consent',
	'enable-mark-solution',
	'final-checklist',
] as const;
export type OnboardingPage = (typeof pages)[number];

export type SubmittedData = {
	server?: ServerPublic & {
		highestRole: 'Owner' | 'Administrator' | 'Manage Guild';
		hasBot: boolean;
	};
	communityType?: 'Commercial' | 'Non-Commercial';
	communityTopic?: 'Gaming' | 'Education' | 'Software' | 'Other';
};

export type OnboardingData = {
	goToPage: (page: OnboardingPage) => void;
	data: SubmittedData;
	setData: (data: SubmittedData) => void;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const OnboardingContext = React.createContext<OnboardingData | null>(
	null,
);

export const useOnboardingContext = () => {
	const context = React.useContext(OnboardingContext);
	if (context === null) {
		throw new Error(
			'`useOnboardingContext` must be used within a `OnboardingContext`',
		);
	}
	return context;
};
