// place files you want to import through the `$lib` alias in this folder.

import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

export let newState = writable(true);

export let key = 'recents';
export function saveToLocalStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

export function readFromLocalStorage(key) {
	const data = localStorage.getItem(key);
	return JSON.parse(data);
}

let toastKey = 'recents';

export function setToast(data) {
	setContext(toastKey, writable(data));
}

export function getToast() {
	return getContext(toastKey);
}

/** Dispatch event on click outside of node */
export function clickOutside(node) {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
