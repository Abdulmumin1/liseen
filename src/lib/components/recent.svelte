<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { HistoryIcon, PanelRightOpen, Play, Trash, X } from 'lucide-svelte';
	import { saveToLocalStorage, key, readFromLocalStorage, clickOutside } from '$lib/index.js';

	let open = false;

	function openRecent() {
		sfs = false;
		open = true;
	}

	function closeRecent() {
		setTimeout(() => (sfs = true), 400);
		open = false;
	}

	function clearRecent() {
		recent = [];
		saveToLocalStorage(key, recent);
	}

	let recent = [];
	onMount(() => {
		recent = readFromLocalStorage(key) ?? [];
	});

	export let playing, buffering, getVideoTitle, loading, player, youtubeLink;

	function play(link) {
		closeRecent();

		playing = false;
		buffering = false;
		loading = true;
		player = false;
		youtubeLink = link;
		document.getElementById('player')?.remove();

		getVideoTitle(link);
	}

	// $: {
	// 	let l = loading;
	// 	if (browser) {
	// 		recent = readFromLocalStorage(key) ?? [];
	// 	}
	// }

	let sfs = true;

	function formatDate(date) {
		date = new Date(date);
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		const month = months[date.getMonth()];
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

		return `${month} ${day}, ${formattedHours}:${formattedMinutes} ${ampm}`;
	}
</script>

<div class="absolute center z-50 left-1 flex flex-col">
	{#if open}
		<div
			use:clickOutside
			on:click_outside={closeRecent}
			in:fly={{ x: -100 }}
			out:fly={{ x: -200 }}
			class="h-[380px] w-[220px] flex"
		>
			<div class="flex flex-col w-full">
				<div class="flex justify-between text-black rounded-t-lg bg-red-500">
					<h4 class=" flex p-2 gap-2"><HistoryIcon /> Recent</h4>
					<button on:click={clearRecent} class="p-2 active:scale-50 transition-all duration-300"
						><Trash /></button
					>
				</div>
				<div class="flex flex-col flex-1 gap-1 overflow-auto bg-stone-900 rounded-b-lg">
					{#each recent as r}
						<div class="text-[10px]">
							{formatDate(r.date)}
							<!-- {r.date} -->
						</div>
						<div class="p-2 bg-stone-800 text-sm flex justify-between">
							{r.title}
							<!-- {r.url} -->

							<button
								on:click={() => {
									play(r.url);
								}}
								class="text-red-500"><Play /></button
							>
						</div>
					{/each}
				</div>
				<button
					on:click={closeRecent}
					class="flex gap-1 h-fit rounded-r-lg bg-red-500 w-fit p-2 text-black"
				>
					<X />

					<span>Recents</span>
				</button>
			</div>
		</div>
	{:else if sfs}
		<button
			in:fly={{ x: -100 }}
			on:click={openRecent}
			class="flex fixed top-0 flex-col gap-1 rounded-r-lg bg-red-500 w-fit p-2 text-black"
		>
			<PanelRightOpen />
			<span class="d">Recents</span>
		</button>
	{/if}
</div>

<style>
	.center {
		top: 50%;
		translate: 0% -50%;
	}

	.d {
		writing-mode: vertical-lr;
		/* padding: 1px; */
	}
</style>
