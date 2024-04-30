<script>
	import {
		Pause,
		Play,
		Youtube,
		Loader2,
		PlusCircleIcon,
		Repeat2,
		SkipForwardIcon,
		ListVideo,
		ListVideoIcon,
		SkipBackIcon
	} from 'lucide-svelte';
	import { newState } from '$lib/index.js';

	import { fly } from 'svelte/transition';
	import { createEventDispatcher, getContext, onMount } from 'svelte';

	import { getToast } from '$lib/index.js';
	import { saveToLocalStorage, key, readFromLocalStorage } from '$lib/index.js';

	let playlist = getContext('playlist');
	let currently_playing = getContext('currently_playing');
	let toast = getToast();
	// getContext

	export let response, fetchVideo, playing, buffering, playVideoAsAudio, youtubeLink;

	function removeObjectContainingItem(list, key, value) {
		for (let i = 0; i < list.length; i++) {
			const obj = list[i];
			if (obj.hasOwnProperty(key) && obj[key] === value) {
				list.splice(i, 1);
				return true; // Object containing item removed successfully
			}
		}
		return false; // Item not found in any object in the list
	}

	function addToFrontOfList(list, item) {
		list.unshift(item);
		return list; // Optionally return the modified list
	}

	let repeat = false;

	function next() {
		// const index = (element) => element == $currently_playing;
		let current_index = $playlist.videoIds.indexOf($currently_playing);
		// console.log($currently_playing, current_index);
		let next_index = current_index + 1;
		next_index = $playlist.videoIds.indexOf($playlist.videoIds[next_index]);

		if (next_index > -1) {
			let nex = $playlist.videoIds[next_index];
			fetchVideo(nex);
		} else {
			$toast = { message: "Can't go any further :/" };
		}
	}

	function previous() {
		// const index = (element) => element == $currently_playing;
		let current_index = $playlist.videoIds.indexOf($currently_playing);
		// console.log($currently_playing, current_index);
		let prev_index = current_index - 1;
		prev_index = $playlist.videoIds.indexOf($playlist.videoIds[prev_index]);
		// console.log(next);

		if (prev_index > -1) {
			let prev = $playlist.videoIds[prev_index];
			fetchVideo(prev);
		} else {
			$toast = { message: "Can't go any further :/" };
		}
	}

	onMount(() => {
		// if (response.title) {
		// 	let record = readFromLocalStorage(key);
		// 	if (record) {
		// 		removeObjectContainingItem(record, 'title', response.title);
		// 	} else {
		// 		record = [];
		// 	}
		// 	let save = { title: response.title, url: youtubeLink, date: new Date() };
		// 	record = addToFrontOfList(record, save);
		// 	saveToLocalStorage(key, record);
		// }
	});

	let dispatcher = createEventDispatcher();

	function dispatchLoop() {
		dispatcher('loop', { repeat });
	}
</script>

<div class="w-full gap-2 p-2 flex flex-col" transition:fly={{ y: 300 }}>
	<div class="text-sm flex gap-1 items-center justify-center">
		<ListVideoIcon />
		{response?.title}
	</div>

	{#if response?.thumbnails}
		<div class="relative">
			<div class="blub relative">
				<!-- style="background-image: url({response.thumbnails.default.url}); height:360px;" -->
				<img
					src={response?.thumbnails?.high?.url}
					alt=""
					srcset=""
					class="relative z-10 rounded-xl"
				/>
			</div>
		</div>
	{/if}
	<div class=" w-full px-4 flex justify-center items-center gap-2">
		{#if response?.title}
			<button
				on:click={() => {
					newState.set(true);
					playing = false;
					buffering = false;
					$playlist = false;
					document.getElementById('player')?.remove();
				}}
				class="bg-stone-900 hover:w-fit hover:px-2 focus:px-2 focus:w-fit group hover:scale-110 hover:rounded-xl transition-all duration-100 w-10 h-10 rounded-full flex items-center justify-center text-red-500"
				><PlusCircleIcon /><span class="group-hover:flex group-focus:flex hidden">&nbsp;New</span
				></button
			>
			<button
				on:click={previous}
				class="bg-stone-900 hover:scale-110 hover:rounded-xl transition-all duration-100 w-10 h-10 rounded-full flex items-center justify-center text-red-500"
				><SkipBackIcon /></button
			>

			<button
				on:click={playVideoAsAudio}
				class="bg-red-500 w-16 h-16 rounded-lg text-black flex items-center justify-center"
			>
				{#if !buffering}
					{#if playing}
						<Pause />
					{:else}
						<Play />
					{/if}
				{:else}
					<div class="animate-spin"><Loader2 /></div>
				{/if}
			</button>

			<button
				on:click={next}
				class="bg-stone-900 hover:scale-110 hover:rounded-xl transition-all duration-100 w-10 h-10 rounded-full flex items-center justify-center text-red-500"
				><SkipForwardIcon /></button
			>

			<button
				on:click={() => {
					// newState.set(true);
					repeat = !repeat;
					dispatchLoop();
				}}
				class=" w-10 h-10 rounded-full flex items-center justify-center {repeat
					? 'bg-red-500 text-stone-900'
					: 'text-red-500 bg-stone-900'}"><Repeat2 /></button
			>
		{/if}
	</div>
</div>

<style>
	/* .blub {
		height: 60%;
	} */
	.blub::before {
		content: '';
		/* padding: ; */
		filter: blur(40px);
		/* border-radius: 100%; */
		border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
		width: 107%;

		height: 107%;
		position: absolute;
		background: rgb(69, 0, 0);
		background: linear-gradient(90deg, rgba(69, 0, 0, 1) 14%, rgba(239, 68, 64, 1) 71%);
		top: 0;
		/* right: 0; */
		left: 50%;
		translate: -50% 0%;
		/* z-index:; */
		/* transform: translate(50%, 50%); */
		padding: 20px;
		animation: morph 8s linear infinite;
	}

	/* @keyframes rotate {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	} */

	@keyframes morph {
		0% {
			border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
			/* background: linear-gradient(45deg, var(--primary) 0%, var(--secondary) 100%); */
		}

		50% {
			border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
			/* background: linear-gradient(45deg, var(--third) 0%, var(--secondary) 100%); */
		}

		100% {
			border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
			/* background: linear-gradient(45deg, var(--primary) 0%, var(--secondary) 100%); */
			/* rotate: 360deg; */
		}
	}
</style>
