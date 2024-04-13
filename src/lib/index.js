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
