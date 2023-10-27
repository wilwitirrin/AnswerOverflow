import { type ClassValue, clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge/src/lib/tw-merge';

export function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}
