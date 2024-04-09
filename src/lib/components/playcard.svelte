<script>
	import {
		MoveRight,
		Pause,
		Play,
		Youtube,
		AudioLines,
		Loader2,
		StopCircleIcon,
		PlusCircleIcon
	} from 'lucide-svelte';
	import { newState } from '$lib/index.js';
	import { fly } from 'svelte/transition';

	export let response, playing, buffering, playVideoAsAudio;
</script>

<div class="w-full gap-2 p-2 flex flex-col" transition:fly={{ y: 200 }}>
	<div class="text-sm flex gap-1 items-center justify-center">
		<Youtube />
		{response?.title ?? response}
	</div>
	{#if response.thumbnails}
		<img src={response.thumbnails.high.url} alt="" srcset="" class="blub" />
	{/if}
	<div class=" w-full px-4 flex justify-center items-center gap-2">
		{#if response.title}
			<button
				on:click={() => {
					newState.set(true);
				}}
				class="bg-stone-900 w-10 h-10 rounded-full flex items-center justify-center text-red-500"
				><PlusCircleIcon /></button
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
				class="bg-stone-900 w-10 h-10 rounded-full flex items-center justify-center text-red-500"
				><StopCircleIcon /></button
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
		width: 1000px;
		height: 100px;
		position: absolute;
		background-color: red;
		top: 0;
		right: 0;
		z-index: 30;
		padding: 20px;
	}
</style>
