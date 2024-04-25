// place files you want to import through the `$lib` alias in this folder.

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
